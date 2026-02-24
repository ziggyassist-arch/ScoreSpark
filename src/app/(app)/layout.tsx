"use client";

import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";
import { FavoritesProvider } from "@/lib/favorites";
import { SpoilerModeProvider } from "@/lib/spoiler-mode";
import { StreakProvider } from "@/lib/streak";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
    <FavoritesProvider>
    <StreakProvider>
    <SpoilerModeProvider>
      <div className="min-h-screen bg-navy-dark">
        <Navigation />
        {/* Main content area - offset for left sidebar + top tab bar on desktop, header+tabs+bottom bar on mobile */}
        <div className="md:ml-20 lg:ml-56 pb-20 md:pb-0 pt-24 md:pt-12">
          <div className="max-w-[1200px] mx-auto px-4 py-6 flex gap-6">
            {/* Primary content */}
            <main className="flex-1 min-w-0">{children}</main>
            {/* Right sidebar — desktop only */}
            <div className="hidden xl:block w-[300px] shrink-0 sticky top-16 self-start">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </SpoilerModeProvider>
    </StreakProvider>
    </FavoritesProvider>
    </AuthProvider>
  );
}
