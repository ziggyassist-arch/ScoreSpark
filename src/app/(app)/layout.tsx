"use client";

import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { FavoritesProvider } from "@/lib/favorites";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-navy-dark">
        <Navigation />
        {/* Main content area - offset for left sidebar on desktop, bottom bar on mobile */}
        <div className="md:ml-20 lg:ml-56 pb-20 md:pb-0 pt-14 md:pt-0">
          <div className="max-w-[1200px] mx-auto px-4 py-6 flex gap-6">
            {/* Primary content */}
            <main className="flex-1 min-w-0">{children}</main>
            {/* Right sidebar — desktop only */}
            <div className="hidden xl:block w-[300px] shrink-0 sticky top-6 self-start">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </FavoritesProvider>
  );
}
