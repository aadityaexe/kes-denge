import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import PortfolioItem from "@/models/Portfolio";
import Client from "@/models/Client";
import Testimonial from "@/models/Testimonial";
import TeamMember from "@/models/Team";
import Message from "@/models/Message";
import BlogPost from "@/models/Blog";
import FAQItem from "@/models/FAQ";
import PricingTier from "@/models/Pricing";
import Media from "@/models/Media";

import Product from "@/models/Product";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();

    const [
      servicesCount,
      productsCount,
      portfolioCount,
      clientsCount,
      testimonialsCount,
      teamCount,
      messagesTotal,
      messagesNew,
      blogCount,
      faqCount,
      pricingCount,
      mediaCount,
      recentMessages,
      recentProjects,
    ] = await Promise.all([
      Service.countDocuments(),
      Product.countDocuments(),
      PortfolioItem.countDocuments(),
      Client.countDocuments(),
      Testimonial.countDocuments(),
      TeamMember.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: "new" }),
      BlogPost.countDocuments(),
      FAQItem.countDocuments(),
      PricingTier.countDocuments(),
      Media.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5),
      PortfolioItem.find().sort({ createdAt: -1 }).limit(4),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        services: servicesCount,
        products: productsCount,
        portfolio: portfolioCount,
        clients: clientsCount,
        testimonials: testimonialsCount,
        team: teamCount,
        messages: messagesTotal,
        newMessages: messagesNew,
        blogs: blogCount,
        faqs: faqCount,
        pricing: pricingCount,
        media: mediaCount,
      },
      recentMessages,
      recentProjects,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch dashboard statistics") },
      { status: 500 }
    );
  }
}
