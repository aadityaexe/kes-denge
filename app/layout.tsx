import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";

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

export const metadata: Metadata = {
  title: {
    default: "Kas Denge Technologies — We Build Digital Products That Scale",
    template: "%s | Kas Denge Technologies",
  },
  description:
    "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kasdenge.com",
    siteName: "Kas Denge Technologies",
    title: "Kas Denge Technologies — We Build Digital Products That Scale",
    description:
      "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kas Denge Technologies — We Build Digital Products That Scale",
    description:
      "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kasdenge.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kas Denge Technologies",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
  sameAs: [
    "https://linkedin.com/company/kas-denge",
    "https://github.com/kas-denge",
    "https://twitter.com/kasdenge",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales and Technical Inquiries",
    email: "hello@kasdenge.com",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kas Denge Technologies",
  url: siteUrl,
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

