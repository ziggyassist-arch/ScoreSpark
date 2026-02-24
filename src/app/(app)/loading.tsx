import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Image
        src="/scorespark_white_transparent_bg.png"
        alt="Loading..."
        width={48}
        height={48}
        className="h-12 w-12 object-contain animate-pulse-glow"
        priority
      />
    </div>
  );
}
