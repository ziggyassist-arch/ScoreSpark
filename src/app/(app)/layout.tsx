"use client";

import Navigation from "@/components/Navigation";
import { FavoritesProvider } from "@/lib/favorites";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-navy-dark">
        <Navigation />
        {/* Main content area - offset for sidebar on desktop, bottom bar on mobile */}
        <main className="md:ml-20 lg:ml-56 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </FavoritesProvider>
  );
}
