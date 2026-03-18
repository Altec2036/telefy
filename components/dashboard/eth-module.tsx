import { Coins } from "lucide-react";
import { getEthBalance } from "@/lib/server/portfolio";
import { LiquidCard } from "@/components/dashboard/liquid-card";
import { Sparkline } from "@/components/dashboard/sparkline";
import { I18N, type Lang } from "@/lib/i18n";

type EthModuleProps = {
  address: string;
  lang: Lang;
};

function ethSpark(value: number) {
  return Array.from({ length: 20 }, (_, idx) => {
    const phase = idx / 20;
    return value * (0.9 + Math.sin(phase * Math.PI * 1.6) * 0.05 + phase * 0.1);
  });
}

export async function EthModule({ address, lang }: EthModuleProps) {
  const t = I18N[lang];
  const eth = await getEthBalance(address);
  return (
    <LiquidCard className="min-h-[180px]">
      <div className="mb-2 flex items-center gap-2 text-[var(--text-muted)]">
        <Coins size={16} />
        <p className="text-sm uppercase tracking-[0.16em]">{t.eth} Balance</p>
      </div>
      <p className="text-4xl font-bold tracking-tight text-[var(--text-main)]">
        {eth.balance.toFixed(6)}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        ${eth.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <div className="mt-4">
        <Sparkline values={ethSpark(eth.usdValue || 1)} positive />
      </div>
    </LiquidCard>
  );
}
