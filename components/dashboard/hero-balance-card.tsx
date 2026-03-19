"use client";

import { LiquidCard } from "@/components/dashboard/liquid-card";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { cn } from "@/lib/utils";

type HeroBalanceCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  values: number[];
  delay?: number;
  className?: string;
};

export function HeroBalanceCard({
  title,
  value,
  subtitle,
  values,
  delay = 0,
  className,
}: HeroBalanceCardProps) {
  return (
    <LiquidCard className={cn("min-h-[280px]", className)} delay={delay}>
      <div data-tour-id="summary-card">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">{title}</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">{value}</p>
        {subtitle && <p className="mt-2 break-words text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <div className="mt-4">
        <BalanceChart values={values} />
      </div>
    </LiquidCard>
  );
}
