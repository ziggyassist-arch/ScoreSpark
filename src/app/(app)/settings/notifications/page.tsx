"use client";

import Link from "next/link";
import { useNotifications } from "@/lib/notifications";

function Toggle({
  enabled,
  onToggle,
  disabled,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`w-10 h-6 rounded-full transition-colors flex items-center ${
        enabled ? "bg-gold-spark justify-end" : "bg-white/10 justify-start"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <div
        className={`w-5 h-5 rounded-full mx-0.5 transition-all ${
          enabled ? "bg-navy-dark" : "bg-white/30"
        }`}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const { prefs, updatePrefs, permissionStatus, requestPermission } =
    useNotifications();

  const isSupported = permissionStatus !== "unsupported";
  const isGranted = permissionStatus === "granted";
  const isDenied = permissionStatus === "denied";

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
      {/* Back button */}
      <Link
        href="/scores/soccer"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white/90">Notifications</h1>
        <p className="text-sm text-white/40 mt-1">
          Get alerts for goals, match starts, and final scores
        </p>
      </div>

      {/* Browser support warning */}
      {!isSupported && (
        <div className="bg-live-red/10 border border-live-red/20 rounded-xl p-4">
          <p className="text-sm text-live-red font-medium">
            Browser notifications not supported
          </p>
          <p className="text-xs text-white/40 mt-1">
            Your browser doesn&apos;t support push notifications. Try Chrome, Firefox, or Edge.
          </p>
        </div>
      )}

      {/* Permission denied warning */}
      {isDenied && (
        <div className="bg-gold-spark/10 border border-gold-spark/20 rounded-xl p-4">
          <p className="text-sm text-gold-spark font-medium">
            Notifications blocked
          </p>
          <p className="text-xs text-white/40 mt-1">
            You&apos;ve blocked notifications for ScoreSpark. To enable them, click the
            lock icon in your address bar and allow notifications.
          </p>
        </div>
      )}

      {/* Enable notifications */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold text-white/80">
              Enable Notifications
            </p>
            <p className="text-xs text-white/30 mt-0.5">
              {isGranted
                ? "Browser notifications are active"
                : "Allow browser notifications from ScoreSpark"}
            </p>
          </div>
          {isGranted ? (
            <Toggle
              enabled={prefs.enabled}
              onToggle={() => updatePrefs({ enabled: !prefs.enabled })}
            />
          ) : (
            <button
              onClick={requestPermission}
              disabled={!isSupported || isDenied}
              className="px-4 py-2 bg-gold-spark/15 text-gold-spark text-xs font-bold rounded-lg hover:bg-gold-spark/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Allow
            </button>
          )}
        </div>
      </div>

      {/* Notification types */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-wider">
            Alert Types
          </p>
        </div>

        {/* Match Start */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sport-soccer/15 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-sport-soccer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Match Start</p>
              <p className="text-[11px] text-white/25">When a match kicks off</p>
            </div>
          </div>
          <Toggle
            enabled={prefs.matchStart}
            onToggle={() => updatePrefs({ matchStart: !prefs.matchStart })}
            disabled={!prefs.enabled}
          />
        </div>

        {/* Goals */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-live-green/15 flex items-center justify-center">
              <span className="text-live-green text-sm">&#9917;</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Goals</p>
              <p className="text-[11px] text-white/25">
                Instant goal alerts with scorer
              </p>
            </div>
          </div>
          <Toggle
            enabled={prefs.goals}
            onToggle={() => updatePrefs({ goals: !prefs.goals })}
            disabled={!prefs.enabled}
          />
        </div>

        {/* Final Score */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Final Score</p>
              <p className="text-[11px] text-white/25">
                Full time results
              </p>
            </div>
          </div>
          <Toggle
            enabled={prefs.finalScore}
            onToggle={() => updatePrefs({ finalScore: !prefs.finalScore })}
            disabled={!prefs.enabled}
          />
        </div>

        {/* Red Cards */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-live-red/15 flex items-center justify-center">
              <span className="inline-block w-3 h-4 bg-red-500 rounded-[1px]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Red Cards</p>
              <p className="text-[11px] text-white/25">
                Player sent off alerts
              </p>
            </div>
          </div>
          <Toggle
            enabled={prefs.redCards}
            onToggle={() => updatePrefs({ redCards: !prefs.redCards })}
            disabled={!prefs.enabled}
          />
        </div>
      </div>

      {/* Scope */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-wider">
            Scope
          </p>
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-white/70">
              Followed teams only
            </p>
            <p className="text-[11px] text-white/25">
              Only get alerts for teams you follow
            </p>
          </div>
          <Toggle
            enabled={prefs.followedTeamsOnly}
            onToggle={() =>
              updatePrefs({ followedTeamsOnly: !prefs.followedTeamsOnly })
            }
            disabled={!prefs.enabled}
          />
        </div>
      </div>

      {/* Test notification */}
      {prefs.enabled && isGranted && (
        <button
          onClick={() => {
            new Notification("ScoreSpark Test", {
              body: "Notifications are working! You'll get alerts for live matches.",
              icon: "/icon-192.png",
            });
          }}
          className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white/50 hover:text-white/70 transition-all"
        >
          Send Test Notification
        </button>
      )}
    </div>
  );
}
