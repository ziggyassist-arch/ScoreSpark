"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSpoilerMode } from "@/lib/spoiler-mode";
import { useStreak } from "@/lib/streak";
import { useFavorites } from "@/lib/favorites";
import { useSession, signIn, signOut } from "next-auth/react";

// Sport items for the left sidebar
const sportItems = [
  {
    label: "Soccer",
    href: "/scores/soccer",
    logo: "/leagues/pl.png",
    activeColor: "text-sport-soccer",
    activeBg: "bg-sport-soccer/15",
  },
  {
    label: "NFL",
    href: "/scores/nfl",
    logo: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
    activeColor: "text-sport-nfl",
    activeBg: "bg-sport-nfl/15",
  },
  {
    label: "NBA",
    href: "/scores/nba",
    logo: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
    activeColor: "text-sport-nba",
    activeBg: "bg-sport-nba/15",
  },
  {
    label: "NHL",
    href: "/scores/nhl",
    logo: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
    activeColor: "text-sport-nhl",
    activeBg: "bg-sport-nhl/15",
  },
  {
    label: "MLB",
    href: "/scores/mlb",
    logo: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
    activeColor: "text-sport-mlb",
    activeBg: "bg-sport-mlb/15",
  },
];

// Top tab bar items — sport-aware tabs
interface TabItem {
  label: string;
  href: (sport: string) => string;
  /** Show only for these sports; undefined = show for all */
  sports?: string[];
}

const topTabs: TabItem[] = [
  { label: "Scores", href: (sport) => `/scores/${sport}` },
  { label: "Teams", href: (sport) => `/scores/${sport}/teams` },
  { label: "News", href: (sport) => `/scores/${sport}/news` },
  { label: "Top Scorers", href: (sport) => `/scores/${sport}/scorers`, sports: ["soccer"] },
  { label: "Leaders", href: (sport) => `/scores/${sport}/leaders`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Injuries", href: (sport) => `/scores/${sport}/injuries`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Rankings", href: (sport) => `/scores/${sport}/rankings`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Playoffs", href: (sport) => `/scores/${sport}/playoffs`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Transactions", href: (sport) => `/scores/${sport}/transactions`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Depth Charts", href: (sport) => `/scores/${sport}/depth-chart`, sports: ["nfl"] },
  { label: "Fantasy", href: (sport) => `/scores/${sport}/fantasy`, sports: ["nba", "nfl", "nhl", "mlb"] },
  { label: "Following", href: () => "/favorites" },
];

function SpoilerToggle() {
  const { spoilerMode, toggleSpoilerMode } = useSpoilerMode();
  return (
    <button
      onClick={toggleSpoilerMode}
      className={`p-2 rounded-lg transition-all ${
        spoilerMode
          ? "bg-gold-spark/15 text-gold-spark"
          : "text-white/30 hover:text-white/60 hover:bg-white/5"
      }`}
      title={spoilerMode ? "Spoiler mode ON — scores hidden" : "Spoiler mode OFF — scores visible"}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {spoilerMode ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        )}
      </svg>
    </button>
  );
}

function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <span className="text-sm font-medium hidden lg:block">Sign In</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {session.user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gold-spark/20 flex items-center justify-center">
          <span className="text-xs font-bold text-gold-spark">
            {session.user?.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
      )}
      <div className="hidden lg:block flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80 truncate">
          {session.user?.name ?? "User"}
        </p>
        <button
          onClick={() => signOut()}
          className="text-[10px] text-white/30 hover:text-white/50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function StreakBadge() {
  const { streak } = useStreak();
  if (streak <= 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gold-spark/10 rounded-xl">
      <span className="text-base">&#128293;</span>
      <div>
        <p className="text-xs font-bold text-gold-spark tabular-nums">{streak} day{streak !== 1 ? "s" : ""}</p>
        <p className="text-[9px] text-white/30 hidden lg:block">Following Sports</p>
      </div>
    </div>
  );
}

/** Derive the current sport from the URL */
function currentSportFromPath(pathname: string): string {
  for (const sport of ["soccer", "nfl", "nba", "nhl", "mlb"]) {
    if (pathname.includes(`/scores/${sport}`)) return sport;
  }
  return "soccer"; // default
}

/* ── Menu Sub-Components ── */

function MenuSectionLabel({ label }: { label: string }) {
  return (
    <p className="px-5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/20">
      {label}
    </p>
  );
}

function MenuAccountSection() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white/80">Sign In</p>
          <p className="text-[11px] text-white/30">Sync favorites across devices</p>
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
      {session.user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gold-spark/20 flex items-center justify-center">
          <span className="text-sm font-bold text-gold-spark">
            {session.user?.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90 truncate">
          {session.user?.name ?? "User"}
        </p>
        <p className="text-[11px] text-white/30 truncate">{session.user?.email ?? ""}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="p-2 text-white/30 hover:text-white/60 transition-colors"
        title="Sign out"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
    </div>
  );
}

function MenuFavoritesPreview() {
  const { favorites } = useFavorites();
  if (favorites.length === 0) {
    return (
      <div className="px-5 py-2">
        <p className="text-xs text-white/25 italic">No teams followed yet</p>
      </div>
    );
  }
  return (
    <div className="px-5 py-2">
      <p className="text-xs text-white/40">
        {favorites.length} team{favorites.length !== 1 ? "s" : ""} followed
      </p>
    </div>
  );
}

const defaultSportOptions = [
  { value: "soccer", label: "Soccer" },
  { value: "nba", label: "NBA" },
  { value: "nfl", label: "NFL" },
  { value: "nhl", label: "NHL" },
  { value: "mlb", label: "MLB" },
];

function MenuSettingsSection({ activeSport }: { activeSport: string }) {
  const { spoilerMode, toggleSpoilerMode } = useSpoilerMode();
  const [defaultSport, setDefaultSport] = useState("soccer");
  const [showDefaultSportPicker, setShowDefaultSportPicker] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scorespark-default-sport");
      if (stored) setDefaultSport(stored);
    } catch {}
  }, []);

  const handleDefaultSportChange = useCallback((sport: string) => {
    setDefaultSport(sport);
    setShowDefaultSportPicker(false);
    try {
      localStorage.setItem("scorespark-default-sport", sport);
    } catch {}
  }, []);

  return (
    <div className="space-y-0.5">
      {/* Spoiler mode toggle */}
      <button
        onClick={toggleSpoilerMode}
        className="flex items-center gap-3 px-5 py-2.5 w-full text-left hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {spoilerMode ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          )}
        </svg>
        <div className="flex-1">
          <span className="text-sm font-medium text-white/60">Spoiler Mode</span>
        </div>
        <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${spoilerMode ? "bg-gold-spark justify-end" : "bg-white/10 justify-start"}`}>
          <div className={`w-5 h-5 rounded-full mx-0.5 transition-all ${spoilerMode ? "bg-navy-dark" : "bg-white/30"}`} />
        </div>
      </button>

      {/* Default sport picker */}
      <div className="px-5 py-2.5">
        <button
          onClick={() => setShowDefaultSportPicker(!showDefaultSportPicker)}
          className="flex items-center gap-3 w-full text-left"
        >
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <div className="flex-1">
            <span className="text-sm font-medium text-white/60">Default Sport</span>
            <p className="text-[11px] text-white/30 capitalize">{defaultSport}</p>
          </div>
          <svg className={`w-4 h-4 text-white/30 transition-transform ${showDefaultSportPicker ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showDefaultSportPicker && (
          <div className="mt-2 ml-8 space-y-1">
            {defaultSportOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDefaultSportChange(opt.value)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                  defaultSport === opt.value
                    ? "text-gold-spark bg-gold-spark/10"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <Link
        href="/settings/notifications"
        className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <span className="text-sm font-medium text-white/60">Notifications</span>
        <span className="text-[10px] text-white/20 ml-auto">Coming soon</span>
      </Link>
    </div>
  );
}

function MenuAboutSection() {
  const [showVersion, setShowVersion] = useState(false);

  return (
    <div className="space-y-0.5">
      <a
        href="https://github.com/ziggywalsh/ScoreSpark/issues"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-2.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <span className="text-sm font-medium">Send Feedback</span>
        <svg className="w-3.5 h-3.5 text-white/20 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>

      <button
        onClick={() => setShowVersion(!showVersion)}
        className="flex items-center gap-3 px-5 py-2.5 w-full text-left text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span className="text-sm font-medium">About ScoreSpark</span>
      </button>
      {showVersion && (
        <div className="mx-5 p-3 rounded-xl bg-white/5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold tracking-tight inline-flex items-center">
              <span className="text-white">Score</span>
              <svg className="w-3.5 h-3.5 mx-[1px] -mt-[1px]" viewBox="0 0 24 24" fill="#F5C518" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
              </svg>
              <span className="text-[#9DCAED]">Spark</span>
            </span>
          </div>
          <p className="text-[11px] text-white/30">Version 1.0.0</p>
          <p className="text-[11px] text-white/25">Live scores for Soccer, NBA, NFL, NHL, MLB. Built with Next.js.</p>
          <p className="text-[10px] text-white/15 mt-1">Made by Ziggy & Matt</p>
        </div>
      )}

      <Link
        href="/privacy"
        className="flex items-center gap-3 px-5 py-2.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-sm font-medium">Privacy Policy</span>
      </Link>

      <Link
        href="/terms"
        className="flex items-center gap-3 px-5 py-2.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-sm font-medium">Terms of Service</span>
      </Link>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const activeSport = currentSportFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isSportActive = (href: string) => {
    const sport = href.split("/scores/")[1];
    return activeSport === sport;
  };

  const isTabActive = (tabHref: string) => {
    const resolved = tabHref;
    if (resolved === `/scores/${activeSport}`) {
      return pathname === resolved || pathname === `/scores/${activeSport}`;
    }
    return pathname.startsWith(resolved);
  };

  return (
    <>
      {/* Hamburger menu slide-out panel */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface border-l border-white/10 animate-slide-up flex flex-col">
            {/* Header with user info */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-white">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-white/40 hover:text-white/70 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <MenuAccountSection />
            </div>

            <nav className="flex-1 py-2 overflow-y-auto">
              {/* Sports section */}
              <MenuSectionLabel label="Sports" />
              {sportItems.map((sport) => (
                <Link
                  key={sport.href}
                  href={sport.href}
                  className={`flex items-center gap-3 px-5 py-2.5 transition-all ${
                    isSportActive(sport.href)
                      ? `${sport.activeBg} ${sport.activeColor}`
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sport.logo} alt="" className="w-6 h-6 object-contain" />
                  <span className="text-sm font-medium">{sport.label}</span>
                </Link>
              ))}

              <div className="border-t border-white/5 my-2" />

              {/* Favorites & Following */}
              <MenuSectionLabel label="Your Stuff" />
              <MenuFavoritesPreview />
              <Link href="/favorites" className="flex items-center gap-3 px-5 py-2.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="text-sm font-medium">Manage Following</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-3 px-5 py-2.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span className="text-sm font-medium">Premium</span>
              </Link>

              <div className="border-t border-white/5 my-2" />

              {/* Settings section */}
              <MenuSectionLabel label="Settings" />
              <MenuSettingsSection activeSport={activeSport} />

              <div className="border-t border-white/5 my-2" />

              {/* About section */}
              <MenuSectionLabel label="About" />
              <MenuAboutSection />
            </nav>

            {/* Bottom streak badge */}
            <div className="p-4 border-t border-white/5">
              <StreakBadge />
            </div>
          </div>
        </div>
      )}

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <Link href="/scores" className="hover:opacity-80 transition-opacity">
          <span className="text-[22px] font-bold tracking-tight inline-flex items-center">
            <span className="text-white">Score</span>
            <svg className="w-4 h-4 mx-[1px] -mt-[1px]" viewBox="0 0 24 24" fill="#F5C518" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
            </svg>
            <span className="text-[#9DCAED]">Spark</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <SpoilerToggle />
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile top tabs — below header */}
      <div className="md:hidden fixed top-14 left-0 right-0 h-10 bg-surface/95 backdrop-blur-xl border-b border-white/5 z-30">
        <div className="flex items-center h-full px-2 gap-0 overflow-x-auto hide-scrollbar">
          {topTabs
            .filter((tab) => !tab.sports || tab.sports.includes(activeSport))
            .map((tab) => {
              const href = tab.href(activeSport);
              const active = isTabActive(href);
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={`px-3 h-full flex items-center text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "text-gold-spark border-gold-spark"
                      : "text-white/40 border-transparent hover:text-white/60"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
        </div>
      </div>

      {/* Desktop sidebar — sports nav */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-56 bg-surface border-r border-white/5 z-40">
        {/* Logo area */}
        <Link
          href="/scores"
          className="flex items-center justify-center lg:justify-start px-4 py-5 border-b border-white/5 hover:opacity-80 transition-opacity"
        >
          <span className="hidden lg:flex text-[20px] font-bold tracking-tight items-center">
            <span className="text-white">Score</span>
            <svg className="w-3.5 h-3.5 mx-[1px] -mt-[1px]" viewBox="0 0 24 24" fill="#F5C518" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
            </svg>
            <span className="text-[#9DCAED]">Spark</span>
          </span>
          <span className="lg:hidden text-[22px] font-black text-[#F5C518]">S</span>
        </Link>

        {/* Sport navigation */}
        <nav className="flex-1 py-3">
          {sportItems.map((sport) => {
            const active = isSportActive(sport.href);
            return (
              <Link
                key={sport.href}
                href={sport.href}
                className={`flex items-center gap-3 px-4 lg:px-5 py-3 mx-2 rounded-xl transition-all duration-200 group ${
                  active
                    ? `${sport.activeBg} ${sport.activeColor}`
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sport.logo}
                  alt={sport.label}
                  className={`w-6 h-6 object-contain transition-all ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}
                />
                <span className="hidden lg:block text-sm font-medium">{sport.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: spoiler, streak, user */}
        <div className="px-3 py-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-1 justify-center lg:justify-start">
            <SpoilerToggle />
          </div>
          <StreakBadge />
          <UserMenu />
        </div>
      </aside>

      {/* Desktop top tab bar */}
      <div className="hidden md:block fixed top-0 left-20 lg:left-56 right-0 h-12 bg-surface/95 backdrop-blur-xl border-b border-white/5 z-30">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center h-full gap-0">
            {topTabs
              .filter((tab) => !tab.sports || tab.sports.includes(activeSport))
              .map((tab) => {
                const href = tab.href(activeSport);
                const active = isTabActive(href);
                return (
                  <Link
                    key={tab.label}
                    href={href}
                    className={`px-5 h-full flex items-center text-sm font-semibold border-b-2 transition-colors ${
                      active
                        ? "text-gold-spark border-gold-spark"
                        : "text-white/40 border-transparent hover:text-white/60"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile bottom tab bar — sports */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-white/5 z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {sportItems.map((sport) => {
            const active = isSportActive(sport.href);
            return (
              <Link
                key={sport.href}
                href={sport.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${
                  active ? sport.activeColor : "text-white/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sport.logo}
                  alt={sport.label}
                  className={`w-6 h-6 object-contain ${active ? "opacity-100" : "opacity-40"}`}
                />
                <span className="text-[9px] font-semibold">{sport.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
