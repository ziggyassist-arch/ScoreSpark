"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

/* ── Position group mapping ── */

const POSITION_GROUPS: { label: string; positions: string[] }[] = [
  { label: "QB", positions: ["QB"] },
  { label: "RB", positions: ["RB", "FB", "HB"] },
  { label: "WR", positions: ["WR", "SWR"] },
  { label: "TE", positions: ["TE"] },
  { label: "OL", positions: ["LT", "LG", "C", "RG", "RT", "OL", "OT", "OG"] },
  { label: "DL", positions: ["DE", "DT", "NT", "LE", "RE", "DL", "RDE", "LDE", "RDT", "LDT"] },
  { label: "LB", positions: ["LB", "MLB", "OLB", "ILB", "ROLB", "LOLB", "RILB", "LILB", "SLB", "WLB", "WILL", "MIKE", "SAM"] },
  { label: "DB", positions: ["CB", "S", "SS", "FS", "DB", "LCB", "RCB", "NB", "SCB"] },
  { label: "K/P", positions: ["K", "P", "PK", "LS", "H", "KR", "PR", "KOS"] },
];

function getGroupForPosition(pos: string): string {
  for (const group of POSITION_GROUPS) {
    if (group.positions.includes(pos.toUpperCase())) return group.label;
  }
  return "Other";
}

/* ── Types ── */

interface Team {
  id: string;
  displayName: string;
  abbreviation: string;
  logo?: string;
}

interface DepthSlotAthlete {
  id: string;
  displayName: string;
  headshot?: { href: string };
  jersey?: string;
  position?: { abbreviation: string };
}

interface DepthSlot {
  rank: number;
  athlete: DepthSlotAthlete;
}

interface DepthPosition {
  position: { abbreviation: string; displayName: string };
  athletes: DepthSlot[];
}

interface DepthChartType {
  id: string;
  name: string;
  positions: DepthPosition[];
}

interface DepthChartResponse {
  items: DepthChartType[];
}

interface GroupedEntry {
  position: string;
  positionName: string;
  first?: DepthSlotAthlete;
  second?: DepthSlotAthlete;
  third?: DepthSlotAthlete;
}

/* ── Component ── */

export default function DepthChartPage() {
  const { sport } = useParams<{ sport: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [depthData, setDepthData] = useState<DepthChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("All");

  // Fetch team list
  useEffect(() => {
    if (sport !== "nfl") return;
    setTeamsLoading(true);
    fetch(`/api/v1/teams?sport=nfl`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch teams");
        return r.json();
      })
      .then((d) => {
        const sorted = (d.teams ?? []).sort((a: Team, b: Team) =>
          a.displayName.localeCompare(b.displayName)
        );
        setTeams(sorted);
      })
      .catch(() => setError("Failed to load teams"))
      .finally(() => setTeamsLoading(false));
  }, [sport]);

  // Fetch depth chart for selected team
  const fetchDepthChart = useCallback((teamId: string) => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    setDepthData(null);
    fetch(`/api/v1/depth-chart?teamId=${teamId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setDepthData(d))
      .catch(() => setError("Failed to load depth chart"))
      .finally(() => setLoading(false));
  }, []);

  const handleTeamChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const teamId = e.target.value;
      setSelectedTeam(teamId);
      if (teamId) fetchDepthChart(teamId);
    },
    [fetchDepthChart]
  );

  // Show only for NFL
  if (sport !== "nfl") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Depth charts are only available for NFL</p>
      </div>
    );
  }

  // Parse depth chart data into grouped entries
  const groupedByPosition: Map<string, GroupedEntry[]> = new Map();

  if (depthData?.items) {
    // Use the first depth chart type (usually "offense" is first, then defense, special teams)
    for (const chartType of depthData.items) {
      for (const pos of chartType.positions ?? []) {
        const abbr = pos.position?.abbreviation ?? "??";
        const groupLabel = getGroupForPosition(abbr);

        const entry: GroupedEntry = {
          position: abbr,
          positionName: pos.position?.displayName ?? abbr,
          first: pos.athletes?.find((a) => a.rank === 1)?.athlete,
          second: pos.athletes?.find((a) => a.rank === 2)?.athlete,
          third: pos.athletes?.find((a) => a.rank === 3)?.athlete,
        };

        if (!groupedByPosition.has(groupLabel)) {
          groupedByPosition.set(groupLabel, []);
        }
        groupedByPosition.get(groupLabel)!.push(entry);
      }
    }
  }

  const groupLabels = ["All", ...POSITION_GROUPS.map((g) => g.label)];
  if (groupedByPosition.has("Other")) groupLabels.push("Other");

  const visibleGroups =
    activeGroup === "All"
      ? Array.from(groupedByPosition.entries())
      : Array.from(groupedByPosition.entries()).filter(([k]) => k === activeGroup);

  const selectedTeamObj = teams.find((t) => t.id === selectedTeam);

  return (
    <div>
      {/* Header */}
      <h1 className="text-xl font-bold text-white mb-1">NFL Depth Charts</h1>
      <p className="text-xs text-white/30 mb-5">Current roster depth by position</p>

      {/* Team selector */}
      <div className="mb-6">
        <div className="relative">
          <select
            value={selectedTeam}
            onChange={handleTeamChange}
            disabled={teamsLoading}
            className="w-full sm:w-72 bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-white/20 transition-colors disabled:opacity-40"
          >
            <option value="" className="bg-surface text-white/50">
              {teamsLoading ? "Loading teams..." : "Select a team"}
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id} className="bg-surface text-white">
                {team.displayName}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Team badge */}
      {selectedTeamObj && (
        <div className="flex items-center gap-3 mb-5">
          {selectedTeamObj.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedTeamObj.logo}
              alt=""
              className="w-10 h-10 object-contain"
            />
          )}
          <div>
            <p className="text-lg font-bold text-white">{selectedTeamObj.displayName}</p>
            <p className="text-xs text-white/30">{selectedTeamObj.abbreviation}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Image
            src="/scorespark_white_transparent_bg.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain animate-pulse-glow opacity-40"
          />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {/* Empty state before selection */}
      {!selectedTeam && !loading && (
        <div className="py-16 text-center">
          <svg
            className="w-12 h-12 text-white/10 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
          <p className="text-white/30 text-sm">Select a team to view their depth chart</p>
        </div>
      )}

      {/* Depth chart content */}
      {!loading && depthData && visibleGroups.length > 0 && (
        <>
          {/* Position group filter tabs */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto hide-scrollbar pb-1">
            {groupLabels
              .filter((g) => g === "All" || groupedByPosition.has(g))
              .map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeGroup === g
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/50 hover:bg-white/5"
                  }`}
                >
                  {g}
                </button>
              ))}
          </div>

          {/* Position groups */}
          {visibleGroups.map(([groupLabel, entries]) => (
            <div
              key={groupLabel}
              className="mb-5 bg-card rounded-xl border border-white/5 overflow-hidden"
            >
              {/* Group header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="text-sm font-bold text-white/80">{groupLabel}</span>
                <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded-full">
                  {entries.length}
                </span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1 px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-wider border-b border-white/5">
                <span>Pos</span>
                <span>1st String</span>
                <span>2nd String</span>
                <span>3rd String</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {entries.map((entry, idx) => (
                  <div
                    key={`${entry.position}-${idx}`}
                    className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1 px-4 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Position label */}
                    <span className="text-xs font-bold text-white/50">{entry.position}</span>

                    {/* 1st string */}
                    <PlayerCell athlete={entry.first} rank={1} />

                    {/* 2nd string */}
                    <PlayerCell athlete={entry.second} rank={2} />

                    {/* 3rd string */}
                    <PlayerCell athlete={entry.third} rank={3} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Empty depth chart (selected team but no data) */}
      {!loading && selectedTeam && depthData && visibleGroups.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-white/30 text-sm">No depth chart data available for this team</p>
        </div>
      )}
    </div>
  );
}

/* ── Player Cell ── */

function PlayerCell({
  athlete,
  rank,
}: {
  athlete?: DepthSlotAthlete;
  rank: number;
}) {
  if (!athlete) {
    return <span className="text-xs text-white/15">--</span>;
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      {athlete.headshot?.href ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={athlete.headshot.href}
          alt=""
          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p
          className={`text-xs font-medium truncate ${
            rank === 1 ? "text-white/90" : "text-white/50"
          }`}
        >
          {athlete.displayName}
        </p>
        {athlete.jersey && (
          <p className="text-[10px] text-white/25">#{athlete.jersey}</p>
        )}
      </div>
    </div>
  );
}
