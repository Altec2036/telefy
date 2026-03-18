"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition",
        "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white",
        "shadow-[0_0_26px_rgba(124,58,237,0.45)] hover:brightness-110",
        "disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
