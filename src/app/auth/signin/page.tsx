"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuestSignIn = async () => {
    setLoading(true);
    await signIn("credentials", {
      name: guestName || "Sports Fan",
      callbackUrl: "/scores",
    });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/scores" });
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/scorespark_white_transparent_bg.png"
            alt="ScoreSpark"
            width={180}
            height={52}
            className="mx-auto h-12 w-auto mb-2"
            priority
          />
          <p className="text-sm text-white/40 mt-2">
            Your multi-sport companion
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-white/5 space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue as guest</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Guest Login */}
          <div className="space-y-3">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-gold-spark/50"
            />
            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full bg-gold-spark/15 text-gold-spark font-semibold py-3 px-4 rounded-xl hover:bg-gold-spark/25 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue as Guest"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-6">
          Sign in to sync your favorites and settings across devices
        </p>
      </div>
    </div>
  );
}
