import Image from "next/image";
import WaitlistForm from "./waitlist-form";

const features = [
  {
    icon: "⚽",
    title: "800+ Soccer Leagues",
    description:
      "From the Premier League to obscure lower divisions — if there's a match, we've got the score.",
  },
  {
    icon: "🏀",
    title: "NBA & NFL Coverage",
    description:
      "Complete American sports coverage with play-by-play updates, box scores, and standings.",
  },
  {
    icon: "⚡",
    title: "Real-Time Updates",
    description:
      "Sub-second score updates powered by lightning-fast data feeds. Never miss a goal again.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description:
      "AI-powered alerts that know what matters to you. Goals, red cards, upsets — your call.",
  },
  {
    icon: "📊",
    title: "Beautiful Data Viz",
    description:
      "Stunning charts and visualizations that make complex stats instantly understandable.",
  },
  {
    icon: "🎯",
    title: "Draft Projections",
    description:
      "Mock drafts and prospect rankings powered by advanced analytics and machine learning.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ScoreSpark"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>
          <a
            href="#waitlist"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-gold-spark text-navy-dark hover:bg-gold-spark/90 transition-all hover:scale-105 active:scale-95"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-indigo-dusk pt-16">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-spark/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <Image
              src="/logo.png"
              alt="ScoreSpark"
              width={280}
              height={80}
              className="mx-auto mb-8 h-16 md:h-20 w-auto animate-float"
              priority
            />
          </div>

          <h1 className="animate-fade-in-up-delay text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
            Live Scores,{" "}
            <span className="bg-gradient-to-r from-blue-accent to-gold-spark bg-clip-text text-transparent">
              Smarter.
            </span>
          </h1>

          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time scores across 800+ soccer leagues, NBA, NFL and more.
            Beautiful visualizations. Intelligent alerts. The sports companion
            you&apos;ve been waiting for.
          </p>

          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full bg-gold-spark text-navy-dark hover:bg-gold-spark/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold-spark/20"
            >
              Get Early Access
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border border-white/20 text-white/80 hover:bg-white/5 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up-delay-3 mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              ["800+", "Leagues"],
              ["50ms", "Latency"],
              ["24/7", "Coverage"],
            ].map(([stat, label]) => (
              <div key={label}>
                <div className="text-2xl md:text-3xl font-black text-gold-spark">
                  {stat}
                </div>
                <div className="text-sm text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse-glow" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-navy-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-dusk/50 to-transparent h-32" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <p className="text-blue-accent font-semibold text-sm uppercase tracking-widest mb-4">
              Features
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Everything you need.
              <br />
              <span className="text-white/40">Nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-accent/5 to-gold-spark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section
        id="waitlist"
        className="py-32 bg-indigo-dusk relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-spark/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-spark/10 border border-gold-spark/20 text-gold-spark text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-gold-spark rounded-full animate-pulse-glow" />
            Coming Soon
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Be the first
            <br />
            to know.
          </h2>

          <p className="text-lg text-white/50 mb-12 max-w-md mx-auto">
            Join the waitlist and get early access when we launch. No spam,
            just the spark.
          </p>

          <WaitlistForm />

          <p className="text-sm text-white/30 mt-6">
            Free forever for early adopters. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-navy-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ScoreSpark"
                width={120}
                height={35}
                className="h-7 w-auto opacity-60"
              />
            </div>

            <div className="flex items-center gap-6">
              {["Twitter", "Discord", "Instagram", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/20">
              © 2026 ScoreSpark. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white/20 hover:text-white/40 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
