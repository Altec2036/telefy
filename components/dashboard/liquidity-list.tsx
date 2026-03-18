"use client";

import { motion } from "framer-motion";
import type { V2LiquidityPosition, V3LiquidityPosition } from "@/lib/types";
import { I18N, type Lang } from "@/lib/i18n";
import { TokenLogo } from "@/components/ui/token-logo";

type LiquidityListProps = {
  positions: Array<V2LiquidityPosition | V3LiquidityPosition>;
  lang: Lang;
};

export function LiquidityList({ positions, lang }: LiquidityListProps) {
  const t = I18N[lang];
  if (!positions.length) {
    return <p className="text-sm text-[var(--text-muted)]">{t.liquidityNotFound}</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06 },
        },
      }}
      className="space-y-3"
    >
      {positions.map((position, index) => (
        <motion.article
          key={`${position.protocol}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          className="rounded-xl border border-[var(--card-border)] bg-black/5 p-3 transition hover:border-violet-400/25"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.16em] text-violet-300">
              {position.protocol.replace("_", " ")}
            </p>
            <p className="font-semibold tracking-tight text-[var(--text-main)]">
              ${position.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-2 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <TokenLogo address={position.token0.address} symbol={position.token0.symbol} size={20} />
              <p className="min-w-0 break-words">
                {position.token0.symbol}: {position.token0.amount.toFixed(6)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TokenLogo address={position.token1.address} symbol={position.token1.symbol} size={20} />
              <p className="min-w-0 break-words">
                {position.token1.symbol}: {position.token1.amount.toFixed(6)}
              </p>
            </div>
          </div>
          {"tokenId" in position && (
            <p className="mt-1 text-xs text-[var(--text-soft)]">
              NFT #{position.tokenId} • fee {position.feeTier} •{" "}
              {position.inRange
                ? lang === "ru"
                  ? "в диапазоне"
                  : "in range"
                : lang === "ru"
                  ? "вне диапазона"
                  : "out of range"}
            </p>
          )}
        </motion.article>
      ))}
    </motion.div>
  );
}
