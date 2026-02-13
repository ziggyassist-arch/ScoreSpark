"use client";

export default function WaitlistForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-5 py-4 rounded-full bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-accent/50 focus:ring-2 focus:ring-blue-accent/20 transition-all"
      />
      <button
        type="submit"
        className="px-8 py-4 rounded-full bg-gold-spark text-navy-dark font-bold hover:bg-gold-spark/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold-spark/20 whitespace-nowrap"
      >
        Join Waitlist
      </button>
    </form>
  );
}
