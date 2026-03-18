"use client";

import { motion } from "framer-motion";
import type { TokenBalanceItem } from "@/lib/types";
import { I18N, type Lang } from "@/lib/i18n";
import { TokenLogo } from "@/components/ui/token-logo";

type TokenListProps = {
  tokens: TokenBalanceItem[];
  lang: Lang;
};

export function TokenList({ tokens, lang }: TokenListProps) {
  const t = I18N[lang];
  if (!tokens.length) {
    return <p className="text-sm text-[var(--text-muted)]">{t.tokensNotFound}</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
      className="space-y-3"
    >
      {tokens.map((token) => (
        <motion.article
          key={token.address}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          className="rounded-xl border border-[var(--card-border)] bg-black/5 p-3 transition hover:border-violet-400/25"
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <TokenLogo address={token.address} symbol={token.symbol} />
              <div className="min-w-0">
                <p className="font-semibold tracking-tight text-[var(--text-main)]">{token.symbol}</p>
                <p className="max-w-full truncate text-xs text-[var(--text-soft)]">{token.address}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm text-[var(--text-muted)]">
                {token.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </p>
              <p className="text-sm font-semibold tracking-tight text-[var(--text-main)]">
                ${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
