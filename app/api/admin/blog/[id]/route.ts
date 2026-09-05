import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/Blog";
import { isValidObjectId, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 });
    }

    await connectToDatabase();
    const post = await BlogPost.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch blog post") },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};

    if (body.title !== undefined) allowedUpdates.title = sanitizeText(body.title, 200);
    if (body.slug !== undefined) {
      const slug = String(body.slug).toLowerCase().trim().replace(/\s+/g, "-");
      if (!isValidSlug(slug)) {
        return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
      }
      // Check collision
      const existing = await BlogPost.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use by another post" }, { status: 400 });
      }
      allowedUpdates.slug = slug;
    }
    if (body.excerpt !== undefined) allowedUpdates.excerpt = sanitizeText(body.excerpt, 2000);
    if (body.content !== undefined) allowedUpdates.content = body.content;
    if (body.featuredImage !== undefined) allowedUpdates.featuredImage = typeof body.featuredImage === "string" ? body.featuredImage.slice(0, 1000) : "";
    if (body.category !== undefined) allowedUpdates.category = sanitizeText(body.category, 100);
    if (body.tags !== undefined && Array.isArray(body.tags)) {
      allowedUpdates.tags = body.tags.map((t: unknown) => sanitizeText(t, 50)).filter(Boolean);
    }
    if (body.author !== undefined && typeof body.author === "object" && body.author !== null) {
      allowedUpdates.author = {
        name: sanitizeText(body.author.name || "Kas Denge Team", 100),
        role: sanitizeText(body.author.role || "Technical Architect", 100),
        avatar: typeof body.author.avatar === "string" ? body.author.avatar.slice(0, 500) : undefined,
      };
    }
    if (body.status !== undefined && ["published", "draft"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.metaTitle !== undefined) allowedUpdates.metaTitle = sanitizeText(body.metaTitle, 200);
    if (body.metaDescription !== undefined) allowedUpdates.metaDescription = sanitizeText(body.metaDescription, 500);
    if (body.readTime !== undefined) allowedUpdates.readTime = sanitizeText(body.readTime, 50);

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update blog post") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete blog post") },
      { status: 500 }
    );
  }
}
