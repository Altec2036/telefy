import { formatUnits, getAddress } from "viem";
import { alchemy, publicClient } from "@/lib/server/clients";
import { erc20Abi } from "@/lib/server/abis";
import { getCache, setCache } from "@/lib/server/cache";
import {
  TRACKED_TOKEN_ADDRESSES,
  TRACKED_TOKEN_MAP_LOWER,
} from "@/lib/server/constants";
import type { TokenBalanceItem } from "@/lib/types";

export type TokenInfo = {
  address: string;
  symbol: string;
  decimals: number;
};

const TOKEN_INFO_TTL_MS = 60 * 60 * 1000;

export async function getTokenInfo(address: string): Promise<TokenInfo> {
  const normalized = getAddress(address);
  const cacheKey = `token:info:${normalized.toLowerCase()}`;
  const cached = getCache<TokenInfo>(cacheKey);
  if (cached) return cached;

  const [symbol, decimals] = await Promise.all([
    publicClient
      .readContract({
        address: normalized,
        abi: erc20Abi,
        functionName: "symbol",
      })
      .catch(() => "UNKNOWN"),
    publicClient
      .readContract({
        address: normalized,
        abi: erc20Abi,
        functionName: "decimals",
      })
      .catch(() => 18),
  ]);

  const info: TokenInfo = {
    address: normalized,
    symbol,
    decimals: Number(decimals),
  };

  setCache(cacheKey, info, TOKEN_INFO_TTL_MS);
  return info;
}

export async function getTrackedTokenBalances(
  address: string,
  tokenUsdPrices: Record<string, number>,
): Promise<TokenBalanceItem[]> {
  const balances = await alchemy.core
    .getTokenBalances(address, TRACKED_TOKEN_ADDRESSES)
    .catch(async () => {
      const tokenBalances = await Promise.all(
        TRACKED_TOKEN_ADDRESSES.map(async (tokenAddress) => {
          const normalized = getAddress(tokenAddress);
          const rawBalance = await publicClient
            .readContract({
              address: normalized,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [getAddress(address)],
            })
            .catch(() => 0n);

          return {
            contractAddress: normalized,
            tokenBalance: `0x${rawBalance.toString(16)}`,
          };
        }),
      );

      return { address, tokenBalances };
    });

  const items = await Promise.all(
    balances.tokenBalances.map(async (tokenBalance) => {
      const tokenAddress = getAddress(tokenBalance.contractAddress);
      const known = TRACKED_TOKEN_MAP_LOWER[tokenAddress.toLowerCase()];
      const info = known
        ? {
            address: tokenAddress,
            symbol: known.symbol,
            decimals: known.decimals,
          }
        : await getTokenInfo(tokenAddress);
      const rawBalance = BigInt(tokenBalance.tokenBalance ?? "0x0");
      const balance = Number(formatUnits(rawBalance, info.decimals));
      const usdPrice = tokenUsdPrices[tokenAddress.toLowerCase()] ?? 0;
      const usdValue = balance * usdPrice;

      return {
        address: tokenAddress,
        symbol: info.symbol,
        decimals: info.decimals,
        balance,
        usdPrice,
        usdValue,
      };
    }),
  );

  return items
    .filter((item) => item.balance > 0)
    .sort((a, b) => b.usdValue - a.usdValue);
}
