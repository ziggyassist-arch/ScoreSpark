export function SkeletonLine({ width = "100%", height = "12px", className = "" }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`rounded-md bg-white/[0.06] animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonMatchRow() {
  return (
    <div className="flex items-center px-2 py-[7px] border-b border-white/[0.04]">
      <div className="w-[52px] flex-shrink-0 flex justify-center">
        <SkeletonLine width="32px" height="12px" />
      </div>
      <div className="flex-1 flex items-center justify-end gap-1.5 pr-2">
        <SkeletonLine width="80px" height="13px" />
        <div className="w-[18px] h-[18px] rounded-sm bg-white/[0.06] animate-pulse flex-shrink-0" />
      </div>
      <div className="w-[48px] flex-shrink-0 flex justify-center">
        <SkeletonLine width="32px" height="14px" />
      </div>
      <div className="flex-1 flex items-center gap-1.5 pl-2">
        <div className="w-[18px] h-[18px] rounded-sm bg-white/[0.06] animate-pulse flex-shrink-0" />
        <SkeletonLine width="80px" height="13px" />
      </div>
    </div>
  );
}

export function SkeletonLeagueSection() {
  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-white/[0.04]">
      <div className="flex items-center gap-2 px-2.5 py-2 bg-white/[0.02]">
        <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse" />
        <SkeletonLine width="120px" height="11px" />
      </div>
      <SkeletonMatchRow />
      <SkeletonMatchRow />
      <SkeletonMatchRow />
    </div>
  );
}

export function SkeletonScoresPage() {
  return (
    <div className="space-y-2 animate-pulse">
      <SkeletonLeagueSection />
      <SkeletonLeagueSection />
      <SkeletonLeagueSection />
    </div>
  );
}

export function SkeletonStandingsRow() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
      <SkeletonLine width="16px" height="12px" />
      <div className="w-5 h-5 rounded bg-white/[0.06] animate-pulse" />
      <SkeletonLine width="100px" height="13px" />
      <div className="flex-1" />
      <SkeletonLine width="20px" height="12px" />
      <SkeletonLine width="20px" height="12px" />
      <SkeletonLine width="20px" height="12px" />
      <SkeletonLine width="24px" height="13px" />
    </div>
  );
}

export function SkeletonCard({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`bg-card rounded-xl border border-white/5 p-4 space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === 0 ? "60%" : i === lines - 1 ? "40%" : "85%"} height="12px" />
      ))}
    </div>
  );
}

export function SkeletonTeamCard() {
  return (
    <div className="bg-card rounded-xl border border-white/5 p-4 flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-white/[0.06] animate-pulse" />
      <SkeletonLine width="80px" height="13px" />
      <SkeletonLine width="50px" height="10px" />
    </div>
  );
}

export function SkeletonPlayerRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
      <SkeletonLine width="24px" height="14px" />
      <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine width="120px" height="13px" />
        <SkeletonLine width="80px" height="10px" />
      </div>
      <SkeletonLine width="40px" height="16px" />
    </div>
  );
}

export function SkeletonDetailHeader() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.06]" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="180px" height="20px" />
          <SkeletonLine width="120px" height="12px" />
        </div>
      </div>
    </div>
  );
}
