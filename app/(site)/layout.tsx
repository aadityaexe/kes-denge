import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/**
 * Public site layout — wraps all public pages with nav, footer,
 * smooth scroll, and scroll progress indicator.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
