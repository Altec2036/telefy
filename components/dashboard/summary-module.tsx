import { Activity, ChartPie, Coins } from "lucide-react";
import { getPortfolio } from "@/lib/server/portfolio";
import { HeroBalanceCard } from "@/components/dashboard/hero-balance-card";
import { Sparkline } from "@/components/dashboard/sparkline";
import { I18N, type Lang } from "@/lib/i18n";

type SummaryModuleProps = {
  address: string;
  lang: Lang;
};

function sparkFromNumber(value: number, points = 20) {
  const base = Math.max(value, 1);
  return Array.from({ length: points }, (_, idx) => {
    const phase = idx / points;
    return base * (0.92 + Math.sin(phase * Math.PI * 2) * 0.04 + phase * 0.08);
  });
}

export async function SummaryModule({ address, lang }: SummaryModuleProps) {
  const t = I18N[lang];
  const portfolio = await getPortfolio(address);
  const totalSpark = sparkFromNumber(portfolio.totalUsd, 24);
  const ethSpark = sparkFromNumber(portfolio.eth.usdValue || 1, 22);
  const trackedTokensUsd = portfolio.tokens.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <HeroBalanceCard
        title={t.totalBalanceUsd}
        value={`$${portfolio.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        subtitle={`${t.addressPrefix}: ${portfolio.address.slice(0, 8)}...${portfolio.address.slice(-6)}`}
        values={totalSpark}
      />

      <article
        id="eth"
        className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl"
      >
        <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
          <Coins size={16} />
          <p className="text-sm uppercase tracking-[0.16em]">{t.eth} Balance</p>
        </div>
        <p className="text-4xl font-bold tracking-tight text-[var(--text-main)]">
          {portfolio.eth.balance.toFixed(6)}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          ${portfolio.eth.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <div className="mt-4">
          <Sparkline values={ethSpark} positive />
        </div>
      </article>

      <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
          <Activity size={16} />
          <p className="text-sm uppercase tracking-[0.16em]">{t.status}</p>
        </div>
        <p className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
          {portfolio.liquidityPositions.length}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{t.activeDefi}</p>
        <p className="mt-4 rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
          {t.updatedAt}: {new Date(portfolio.updatedAt).toLocaleString(lang)}
        </p>
      </article>

      <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
          <ChartPie size={16} />
          <p className="text-sm uppercase tracking-[0.16em]">{t.trackedTokens}</p>
        </div>
        <p className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
          {portfolio.tokens.length}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{t.trackedTokensSubtitle}</p>
        <p className="mt-4 rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
          ${trackedTokensUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </article>
    </div>
  );
}
