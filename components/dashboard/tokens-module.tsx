import { Coins } from "lucide-react";
import { getTokenBalances } from "@/lib/server/portfolio";
import { TokenList } from "@/components/dashboard/token-list";
import { I18N, type Lang } from "@/lib/i18n";

type TokensModuleProps = {
  address: string;
  lang: Lang;
};

export async function TokensModule({ address, lang }: TokensModuleProps) {
  const t = I18N[lang];
  const tokens = await getTokenBalances(address);
  const totalUsd = tokens.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Coins size={16} />
          <h2 className="text-sm uppercase tracking-[0.16em]">{t.tokens} Tokens</h2>
        </div>
        <p className="text-sm font-semibold text-[var(--text-main)]">
          ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
      <TokenList tokens={tokens} lang={lang} />
    </section>
  );
}
