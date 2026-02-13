import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreSpark — Live Sports Scores, Smarter",
  description:
    "Real-time scores across 800+ soccer leagues, NBA, NFL and more. Beautiful data visualization, smart notifications, and draft projections.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-dark text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
