import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";
import { getSettingsData } from "@/lib/db-helpers";

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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MARK Technologies — We Build Digital Products That Scale",
    template: "%s | MARK Technologies",
  },
  description:
    "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.",
  keywords: [
    "MARK Technologies",
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MARK Technologies",
    title: "MARK Technologies — We Build Digital Products That Scale",
    description:
      "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "MARK Technologies — We Build Digital Products That Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARK Technologies — We Build Digital Products That Scale",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettingsData();
  const siteName = settings?.siteName || "MARK Technologies";
  const email = settings?.contactEmail || "hello@mark2.in";
  const sameAs = [
    settings?.socialLinks?.twitter,
    settings?.socialLinks?.linkedin,
    settings?.socialLinks?.github,
    settings?.socialLinks?.instagram,
  ].filter(Boolean);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: "Kas Denge Technologies",
    url: siteUrl,
    email: email,
    sameAs: sameAs.length > 0 ? sameAs : [
      "https://x.com/mark2_in",
      "https://www.linkedin.com/company/mark2-technologies",
      "https://github.com/aadityaexe/kes-denge",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/portfolio?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <Preloader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

