import { Waves } from "lucide-react";
import { getLiquidityPositions } from "@/lib/server/portfolio";
import { LiquidityList } from "@/components/dashboard/liquidity-list";
import { I18N, type Lang } from "@/lib/i18n";

type LiquidityModuleProps = {
  address: string;
  lang: Lang;
};

export async function LiquidityModule({ address, lang }: LiquidityModuleProps) {
  const t = I18N[lang];
  const liquidity = await getLiquidityPositions(address);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Waves size={16} />
          <h2 className="text-sm uppercase tracking-[0.16em]">{t.uniswap} V2/V3</h2>
        </div>
        <p className="text-sm font-semibold text-[var(--text-main)]">
          ${liquidity.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
      <LiquidityList positions={liquidity.positions} lang={lang} />
    </section>
  );
}
