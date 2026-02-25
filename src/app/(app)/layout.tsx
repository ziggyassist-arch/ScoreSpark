"use client";

import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";
import { FavoritesProvider } from "@/lib/favorites";
import { SpoilerModeProvider } from "@/lib/spoiler-mode";
import { StreakProvider } from "@/lib/streak";
import { ThemeProvider } from "@/lib/theme";
import { NotificationProvider } from "@/lib/notifications";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
    <ThemeProvider>
    <NotificationProvider>
    <FavoritesProvider>
    <StreakProvider>
    <SpoilerModeProvider>
      <div className="min-h-screen bg-navy-dark light:bg-gray-50">
        <Navigation />
        {/* Main content area - offset for left sidebar + top tab bar on desktop, header+tabs+bottom bar on mobile */}
        <div className="md:ml-20 lg:ml-56 pb-16 md:pb-0 pt-20 md:pt-12">
          <div className="max-w-[1200px] mx-auto px-2.5 py-3 md:px-4 md:py-6 flex gap-4">
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
    </NotificationProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}
