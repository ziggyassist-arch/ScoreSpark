"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PULSE_EMOJIS } from "@/lib/services/pulse-service";

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number; // 0-100 percent
}

let nextId = 0;

export default function PulseReactions({ matchId }: { matchId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [cooldown, setCooldown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch initial counts
  useEffect(() => {
    fetch(`/api/v1/pulse?matchId=${matchId}`)
      .then((r) => r.json())
      .then((data) => setCounts(data.counts ?? {}))
      .catch(() => {});
  }, [matchId]);

  // SSE stream for live reactions
  useEffect(() => {
    const eventSource = new EventSource(`/api/v1/pulse/stream?matchId=${matchId}`);

    eventSource.onmessage = (event) => {
      try {
        const reaction = JSON.parse(event.data);
        // Add floating emoji
        spawnFloating(reaction.emoji);
        // Update counts
        setCounts((prev) => ({
          ...prev,
          [reaction.emoji]: (prev[reaction.emoji] ?? 0) + 1,
        }));
      } catch {
        // Ignore parse errors
      }
    };

    return () => eventSource.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const spawnFloating = useCallback((emoji: string) => {
    const id = nextId++;
    const x = 10 + Math.random() * 80;
    setFloatingEmojis((prev) => [...prev.slice(-15), { id, emoji, x }]);
    // Remove after animation
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2000);
  }, []);

  const sendReaction = async (emoji: string) => {
    if (cooldown) return;
    setCooldown(true);

    // Optimistic local spawn
    spawnFloating(emoji);
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] ?? 0) + 1,
    }));

    try {
      await fetch("/api/v1/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, emoji }),
      });
    } catch {
      // Revert on error
      setCounts((prev) => ({
        ...prev,
        [emoji]: Math.max((prev[emoji] ?? 1) - 1, 0),
      }));
    }

    setTimeout(() => setCooldown(false), 300);
  };

  const totalReactions = Object.values(counts).reduce((sum, c) => sum + c, 0);

  return (
    <div className="relative" ref={containerRef}>
      {/* Floating emojis */}
      <div className="absolute inset-x-0 bottom-full h-32 pointer-events-none overflow-hidden">
        {floatingEmojis.map((fe) => (
          <span
            key={fe.id}
            className="absolute text-2xl animate-float-up"
            style={{ left: `${fe.x}%`, bottom: 0 }}
          >
            {fe.emoji}
          </span>
        ))}
      </div>

      {/* Reaction bar */}
      <div className="bg-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Pulse
          </h3>
          {totalReactions > 0 && (
            <span className="text-xs text-white/30 tabular-nums">
              {totalReactions.toLocaleString()} reaction{totalReactions !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {PULSE_EMOJIS.map((emoji) => {
            const count = counts[emoji] ?? 0;
            return (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                disabled={cooldown}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                  cooldown
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10 hover:scale-105 active:scale-95"
                } ${count > 0 ? "bg-white/5" : "bg-transparent"}`}
              >
                <span className="text-lg">{emoji}</span>
                {count > 0 && (
                  <span className="text-xs text-white/40 tabular-nums font-medium">
                    {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
