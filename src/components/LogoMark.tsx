import React from "react";

export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "w-8 h-8 text-sm" : size === "lg" ? "w-12 h-12 text-xl" : "w-10 h-10 text-lg";
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${iconSize} bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center`}>
        🎵
      </div>
      <span className={`font-display ${textSize} font-extrabold tracking-tight`}>
        Move<span className="text-primary">Sync</span>
      </span>
    </div>
  );
}
