import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreSpark — Live Sports Scores, Smarter",
  description:
    "Real-time scores across 800+ soccer leagues, NBA, NFL and more. Beautiful data visualization, smart notifications, and draft projections.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("scorespark-theme");if(t==="light"){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light")}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-navy-dark text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
