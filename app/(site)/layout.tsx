import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";

/**
 * Public site layout — wraps all public pages with nav, footer,
 * smooth scroll, preloader, and scroll progress indicator.
 * Admin routes bypass SmoothScroll and Preloader.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </SmoothScroll>
  );
}
