"use client";

import { Sparkline } from "@/components/dashboard/sparkline";
import { LiquidCard } from "@/components/dashboard/liquid-card";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trendPositive?: boolean;
  sparkValues: number[];
  delay?: number;
};

export function MetricCard({
  title,
  value,
  subtitle,
  trendPositive = true,
  sparkValues,
  delay = 0,
}: MetricCardProps) {
  return (
    <LiquidCard delay={delay}>
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-main)]">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      <div className="mt-4">
        <Sparkline values={sparkValues} positive={trendPositive} />
      </div>
    </LiquidCard>
  );
}
