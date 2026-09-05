export default function SiteLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 bg-surface-1">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Sleek animated line loader */}
        <div className="w-24 h-[2px] bg-surface-2 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--color-accent)] rounded-full animate-loading-bar" />
        </div>
        
        {/* Subtle pulsing text */}
        <p className="text-xs font-display font-medium text-text-secondary tracking-[0.2em] uppercase animate-pulse">
          Loading
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}} />
    </div>
  );
}
