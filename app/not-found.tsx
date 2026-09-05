import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16">
      <div className="container-site text-center max-w-2xl">
        <div>
          <div className="mb-8">
            <h1 className="text-[120px] md:text-[180px] font-display font-bold text-[var(--color-accent)]/20 leading-none select-none">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl text-text-primary mt-4 font-display font-semibold">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-xl text-text-secondary mb-12 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/" size="lg">Return Home</Button>
            <Button href="/portfolio" variant="secondary" size="lg">View Our Work</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
