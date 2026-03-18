"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeToggleProps = {
  lightLabel?: string;
  darkLabel?: string;
  className?: string;
};

export function ThemeToggle({
  lightLabel = "Light theme",
  darkLabel = "Dark theme",
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-xs font-medium text-[var(--text-main)] backdrop-blur-xl transition hover:brightness-105",
        className ?? "",
      ].join(" ")}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? lightLabel : darkLabel}</span>
    </button>
  );
}
