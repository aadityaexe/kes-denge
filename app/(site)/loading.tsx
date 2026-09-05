export default function SiteLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-16">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 animate-ping absolute" />
        {/* Spinning gradient ring */}
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-400 animate-spin" />
        {/* Inner core dot */}
        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] absolute" />
      </div>
      <p className="mt-6 text-sm font-mono text-text-secondary tracking-widest uppercase animate-pulse">
        Loading Kas Denge...
      </p>
    </div>
  );
}
