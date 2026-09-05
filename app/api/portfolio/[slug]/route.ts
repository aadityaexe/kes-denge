import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PortfolioItem from "@/models/Portfolio";
import Service from "@/models/Service";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Portfolio slug is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const project = await PortfolioItem.findOne({ slug, isActive: true }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Fetch related projects
    const relatedProjects = await PortfolioItem.find({
      slug: { $ne: slug },
      isActive: true,
      category: project.category,
    })
      .sort({ isFeatured: -1, order: 1 })
      .limit(3)
      .lean();

    // Fetch related services if specified
    let relatedServices: unknown[] = [];
    if (project.relatedServiceSlugs && project.relatedServiceSlugs.length > 0) {
      relatedServices = await Service.find({
        slug: { $in: project.relatedServiceSlugs },
        isActive: true,
      })
        .select("title slug shortDescription icon heroBadge")
        .lean();
    }

    return NextResponse.json({
      success: true,
      project,
      relatedProjects,
      relatedServices,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch portfolio item") },
      { status: 500 }
    );
  }
}
