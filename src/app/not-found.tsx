import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center px-4 text-center">
      <Image
        src="/scorespark_white_transparent_bg.png"
        alt="ScoreSpark"
        width={64}
        height={64}
        className="h-16 w-16 object-contain opacity-20 mb-6"
      />
      <h1 className="text-6xl font-black text-white/10 mb-2">404</h1>
      <p className="text-lg text-white/40 mb-8">
        That page doesn&apos;t exist. Maybe it used to.
      </p>
      <Link
        href="/scores"
        className="px-6 py-2.5 bg-gold-spark/15 text-gold-spark font-semibold rounded-xl hover:bg-gold-spark/25 transition-colors text-sm"
      >
        Back to Scores
      </Link>
    </div>
  );
}
