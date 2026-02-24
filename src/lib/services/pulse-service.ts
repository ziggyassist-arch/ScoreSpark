/**
 * In-memory Pulse reactions store.
 * Each match has a ring buffer of recent reactions and a set of SSE listeners.
 */

export interface PulseReaction {
  emoji: string;
  timestamp: number;
}

interface MatchPulse {
  reactions: PulseReaction[];
  listeners: Set<(reaction: PulseReaction) => void>;
  counts: Record<string, number>;
}

const MAX_RECENT = 50;
const pulseStore = new Map<string, MatchPulse>();

function getOrCreate(matchId: string): MatchPulse {
  let pulse = pulseStore.get(matchId);
  if (!pulse) {
    pulse = { reactions: [], listeners: new Set(), counts: {} };
    pulseStore.set(matchId, pulse);
  }
  return pulse;
}

export function addReaction(matchId: string, emoji: string): PulseReaction {
  const pulse = getOrCreate(matchId);
  const reaction: PulseReaction = { emoji, timestamp: Date.now() };

  pulse.reactions.push(reaction);
  if (pulse.reactions.length > MAX_RECENT) {
    pulse.reactions.shift();
  }

  pulse.counts[emoji] = (pulse.counts[emoji] ?? 0) + 1;

  // Notify all SSE listeners
  for (const listener of pulse.listeners) {
    listener(reaction);
  }

  return reaction;
}

export function subscribe(matchId: string, listener: (reaction: PulseReaction) => void): () => void {
  const pulse = getOrCreate(matchId);
  pulse.listeners.add(listener);
  return () => {
    pulse.listeners.delete(listener);
    // Cleanup empty stores
    if (pulse.listeners.size === 0 && pulse.reactions.length === 0) {
      pulseStore.delete(matchId);
    }
  };
}

export function getCounts(matchId: string): Record<string, number> {
  return pulseStore.get(matchId)?.counts ?? {};
}

export const PULSE_EMOJIS = ["🔥", "⚽", "🎉", "😱", "💪", "❤️", "👏", "😤"];
