import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import ProductCategory from "@/models/ProductCategory";
import Product from "@/models/Product";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

const DEFAULT_CATEGORIES = [
  "ERP",
  "CRM",
  "HRMS",
  "POS",
  "School",
  "Hospital",
  "Inventory",
  "Custom",
];

async function ensureDefaultCategories() {
  const count = await ProductCategory.countDocuments();
  if (count === 0) {
    // Seed default baseline categories
    const initialDocs = DEFAULT_CATEGORIES.map((name, index) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `${name} System Platforms & Solutions`,
      order: index + 1,
      isDefault: true,
    }));
    await ProductCategory.insertMany(initialDocs);
  }

  // Ensure any categories already assigned to existing products are also represented
  const existingProductCategories = await Product.distinct("category");
  for (const catName of existingProductCategories) {
    if (catName && typeof catName === "string") {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const exists = await ProductCategory.findOne({
        $or: [{ slug }, { name: { $regex: new RegExp(`^${catName}$`, "i") } }],
      });
      if (!exists) {
        await ProductCategory.create({
          name: catName.trim(),
          slug,
          description: `${catName} Platforms`,
          order: 99,
          isDefault: false,
        });
      }
    }
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    await ensureDefaultCategories();

    const categories = await ProductCategory.find()
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch product categories") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!isNonEmptyString(name, 100)) {
      return NextResponse.json(
        { error: "Category name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    // Normalize clean slug
    const cleanSlug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Invalid category name resulting in empty slug" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for duplicate name or slug (case-insensitive)
    const existing = await ProductCategory.findOne({
      $or: [
        { slug: cleanSlug },
        { name: { $regex: new RegExp(`^${trimmedName}$`, "i") } },
      ],
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `Category "${existing.name}" already exists`,
          category: existing,
        },
        { status: 409 }
      );
    }

    // Determine next order
    const lastCategory = await ProductCategory.findOne().sort({ order: -1 });
    const nextOrder = (lastCategory?.order || 0) + 1;

    const newCategory = await ProductCategory.create({
      name: sanitizeText(trimmedName, 100),
      slug: cleanSlug,
      description: typeof description === "string" ? sanitizeText(description, 300) : "",
      order: nextOrder,
      isDefault: false,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create category") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const category = await ProductCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if any product is currently utilizing this category
    const count = await Product.countDocuments({ category: category.name });
    if (count > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" because it is currently assigned to ${count} product(s). Reassign them first.`,
        },
        { status: 400 }
      );
    }

    await ProductCategory.findByIdAndDelete(id);

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete category") },
      { status: 500 }
    );
  }
}
