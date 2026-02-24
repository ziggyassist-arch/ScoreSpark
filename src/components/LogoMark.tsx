import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/** S + lightning bolt logo mark — use for loading, empty states, watermarks */
export default function LogoMark({ size = 48, className = "", animate = false }: LogoMarkProps) {
  return (
    <Image
      src="/scorespark_white_transparent_bg.png"
      alt="ScoreSpark"
      width={size}
      height={size}
      className={`object-contain ${animate ? "animate-pulse-glow" : ""} ${className}`}
    />
  );
}
