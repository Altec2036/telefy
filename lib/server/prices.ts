import { getAddress } from "viem";
import { getCache, setCache } from "@/lib/server/cache";

const PRICE_CACHE_TTL_MS = 60_000;
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase();

export async function getEthUsdPrice(): Promise<number> {
  const cacheKey = "price:eth";
  const cached = getCache<number>(cacheKey);
  if (cached !== null) return cached;

  let price = 0;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      const json = (await res.json()) as { ethereum?: { usd?: number } };
      price = Number(json.ethereum?.usd ?? 0);
    }
  } catch {
    price = 0;
  }

  if (price <= 0) {
    try {
      const res = await fetch(
        `https://coins.llama.fi/prices/current/ethereum:${WETH_ADDRESS}`,
        { next: { revalidate: 60 } },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          coins?: Record<string, { price?: number }>;
        };
        price = Number(json.coins?.[`ethereum:${WETH_ADDRESS}`]?.price ?? 0);
      }
    } catch {
      price = 0;
    }
  }

  setCache(cacheKey, price, PRICE_CACHE_TTL_MS);
  return price;
}

export async function getTokenUsdPrices(
  tokenAddresses: string[],
): Promise<Record<string, number>> {
  const normalized = Array.from(
    new Set(tokenAddresses.map((address) => getAddress(address).toLowerCase())),
  );

  if (!normalized.length) return {};

  const cacheKey = `price:tokens:${normalized.sort().join(",")}`;
  const cached = getCache<Record<string, number>>(cacheKey);
  if (cached) return cached;

  const url =
    "https://api.coingecko.com/api/v3/simple/token_price/ethereum" +
    `?contract_addresses=${normalized.join(",")}&vs_currencies=usd`;

  const prices: Record<string, number> = {};
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = (await res.json()) as Record<string, { usd?: number }>;
      for (const address of normalized) {
        prices[address] = Number(json[address]?.usd ?? 0);
      }
    }
  } catch {
    // fallback below
  }

  const unresolved = normalized.filter((address) => !prices[address]);
  if (unresolved.length) {
    try {
      const llamaQuery = unresolved.map((address) => `ethereum:${address}`).join(",");
      const res = await fetch(
        `https://coins.llama.fi/prices/current/${llamaQuery}`,
        { next: { revalidate: 60 } },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          coins?: Record<string, { price?: number }>;
        };
        for (const address of unresolved) {
          prices[address] = Number(json.coins?.[`ethereum:${address}`]?.price ?? 0);
        }
      }
    } catch {
      // fallback below
    }
  }

  for (const address of normalized) {
    if (!Number.isFinite(prices[address])) {
      prices[address] = 0;
    }
  }

  setCache(cacheKey, prices, PRICE_CACHE_TTL_MS);
  return prices;
}
