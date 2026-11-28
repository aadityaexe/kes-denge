import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SEO_CONFIG } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [
    "MARK2",
    "mark2.in",
    "product engineering agency",
    "custom software development",
    "web application development",
    "mobile app development",
    "enterprise ERP solutions",
    "cloud architecture",
    "Next.js engineering",
    "React Native development",
    "AI automation systems",
    "SaaS development agency",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MARK2",
    title: "MARK2 — We Build Digital Products That Scale",
    description:
      "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "MARK2 — We Build Digital Products That Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARK2 — We Build Digital Products That Scale",
    description:
      "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.",
    images: [`${siteUrl}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
