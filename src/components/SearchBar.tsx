"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "team" | "league" | "player";
  id: string;
  name: string;
  shortName?: string;
  badge?: string;
  teamBadge?: string;
  team?: string;
  sport: string;
  href: string;
}

const SPORT_COLORS: Record<string, string> = {
  soccer: "bg-sport-soccer/20 text-sport-soccer",
  nba: "bg-sport-nba/20 text-sport-nba",
  nfl: "bg-sport-nfl/20 text-sport-nfl",
  nhl: "bg-sport-nhl/20 text-sport-nhl",
  mlb: "bg-sport-mlb/20 text-sport-mlb",
};

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIdx(-1);
    onClose?.();
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results ?? []);
          setOpen(true);
          setLoading(false);
          setSelectedIdx(-1);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [close]);

  function navigate(href: string) {
    close();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIdx >= 0 && results[selectedIdx]) {
      e.preventDefault();
      navigate(results[selectedIdx].href);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10 focus-within:border-gold-spark/40 transition-colors">
        <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search teams, leagues..."
          className="bg-transparent text-sm text-white/90 placeholder:text-white/25 outline-none w-full min-w-0"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-gold-spark rounded-full animate-spin flex-shrink-0" />
        )}
        {query && !loading && (
          <button onClick={close} className="text-white/30 hover:text-white/60 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60] max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => navigate(r.href)}
              onMouseEnter={() => setSelectedIdx(i)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                selectedIdx === i ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {(r.type === "team" && r.badge) || (r.type === "player" && r.teamBadge) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.badge || r.teamBadge} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">{r.name}</p>
                <p className="text-[10px] text-white/30 capitalize">{r.type === "player" && r.team ? `${r.team}` : r.type}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SPORT_COLORS[r.sport] ?? "bg-white/10 text-white/40"}`}>
                {r.sport}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-white/10 rounded-xl shadow-2xl p-4 z-[60]">
          <p className="text-sm text-white/30 text-center">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
