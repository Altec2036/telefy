"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm tracking-tight text-[var(--text-main)] outline-none backdrop-blur-md transition",
        "focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20",
        className,
      )}
      {...props}
    />
  );
}
