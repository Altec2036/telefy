"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LiquidCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function LiquidCard({ children, className, delay = 0 }: LiquidCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 backdrop-blur-xl",
        "shadow-[var(--card-shadow)]",
        "before:pointer-events-none before:absolute before:inset-x-2 before:top-0 before:h-6 before:rounded-full before:bg-white/12 dark:before:bg-white/5",
        "relative transition duration-300 hover:scale-[1.01] hover:border-violet-400/30",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
