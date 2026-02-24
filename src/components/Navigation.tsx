"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSpoilerMode } from "@/lib/spoiler-mode";
import { useStreak } from "@/lib/streak";
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

// Top tab bar items
const topTabs = [
  { label: "Leagues", href: (sport: string) => `/scores/${sport}` },
  { label: "Teams", href: (sport: string) => `/scores/${sport}/teams` },
  { label: "News", href: (sport: string) => `/scores/${sport}/news` },
  { label: "Following", href: () => "/favorites" },
  { label: "Mock Draft", href: (sport: string) => `/scores/${sport}/mock-draft` },
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

export default function Navigation() {
  const pathname = usePathname();
  const activeSport = currentSportFromPath(pathname);

  const isSportActive = (href: string) => {
    // Extract sport from href like /scores/nfl
    const sport = href.split("/scores/")[1];
    return activeSport === sport;
  };

  const isTabActive = (tabHref: string) => {
    const resolved = tabHref;
    // Exact match for sport root (Leagues tab)
    if (resolved === `/scores/${activeSport}`) {
      return pathname === resolved || pathname === `/scores/${activeSport}`;
    }
    return pathname.startsWith(resolved);
  };

  return (
    <>
      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <Link href="/scores" className="hover:opacity-80 transition-opacity">
          <span className="text-[22px] font-bold tracking-tight">
            <span className="text-white">Score</span>
            <span className="text-[#F5C518]">Spark</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <SpoilerToggle />
          <button
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
          {topTabs.map((tab) => {
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
          <span className="hidden lg:block text-[20px] font-bold tracking-tight">
            <span className="text-white">Score</span>
            <span className="text-[#F5C518]">Spark</span>
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
            {topTabs.map((tab) => {
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
