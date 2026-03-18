"use client";

import Image from "next/image";
import { useState } from "react";
import { getTokenLogoUrl } from "@/lib/token-assets";

type TokenLogoProps = {
  address: string;
  symbol: string;
  size?: number;
};

export function TokenLogo({ address, symbol, size = 24 }: TokenLogoProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getTokenLogoUrl(address);

  if (failed) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-black/5 text-[10px] font-semibold text-[var(--text-muted)]"
        style={{ width: size, height: size }}
        aria-label={`${symbol} logo fallback`}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className="rounded-full border border-[var(--card-border)] bg-white/70 object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
