import { cache } from "react";
import { formatEther, getAddress, isAddress, type Address } from "viem";
import { publicClient } from "@/lib/server/clients";
import { getEthUsdPrice, getTokenUsdPrices } from "@/lib/server/prices";
import { getTrackedTokenBalances } from "@/lib/server/tokens";
import { getUniswapV2Positions, getUniswapV3Positions } from "@/lib/server/uniswap";
import type {
  PortfolioResponse,
  V2LiquidityPosition,
  V3LiquidityPosition,
} from "@/lib/types";

function collectUniqueTokenAddresses(
  tokenItems: { address: string }[],
  v2: Awaited<ReturnType<typeof getUniswapV2Positions>>,
  v3: Awaited<ReturnType<typeof getUniswapV3Positions>>,
): string[] {
  const set = new Set<string>();
  for (const token of tokenItems) set.add(getAddress(token.address));
  for (const position of v2) {
    set.add(getAddress(position.token0.address));
    set.add(getAddress(position.token1.address));
  }
  for (const position of v3) {
    set.add(getAddress(position.token0.address));
    set.add(getAddress(position.token1.address));
  }
  return Array.from(set);
}

function applyTokenPricesToV2Positions(
  positions: V2LiquidityPosition[],
  prices: Record<string, number>,
): V2LiquidityPosition[] {
  return positions.map((position) => {
    const token0Price = prices[position.token0.address.toLowerCase()] ?? 0;
    const token1Price = prices[position.token1.address.toLowerCase()] ?? 0;
    const token0Usd = position.token0.amount * token0Price;
    const token1Usd = position.token1.amount * token1Price;

    return {
      ...position,
      token0: {
        ...position.token0,
        usdPrice: token0Price,
        usdValue: token0Usd,
      },
      token1: {
        ...position.token1,
        usdPrice: token1Price,
        usdValue: token1Usd,
      },
      totalUsd: token0Usd + token1Usd,
    };
  });
}

function applyTokenPricesToV3Positions(
  positions: V3LiquidityPosition[],
  prices: Record<string, number>,
): V3LiquidityPosition[] {
  return positions.map((position) => {
    const token0Price = prices[position.token0.address.toLowerCase()] ?? 0;
    const token1Price = prices[position.token1.address.toLowerCase()] ?? 0;
    const token0Usd = position.token0.amount * token0Price;
    const token1Usd = position.token1.amount * token1Price;

    return {
      ...position,
      token0: {
        ...position.token0,
        usdPrice: token0Price,
        usdValue: token0Usd,
      },
      token1: {
        ...position.token1,
        usdPrice: token1Price,
        usdValue: token1Usd,
      },
      totalUsd: token0Usd + token1Usd,
    };
  });
}

export function normalizeAddressOrThrow(address: string): Address {
  const normalizedInput = address.trim();
  if (!isAddress(normalizedInput, { strict: false })) {
    throw new Error("Invalid Ethereum address");
  }
  return getAddress(normalizedInput) as Address;
}

const getEthBalanceCached = cache(async (normalizedAddress: Address) => {
  const [balanceWei, usdPrice] = await Promise.all([
    publicClient.getBalance({ address: normalizedAddress }),
    getEthUsdPrice(),
  ]);

  const balance = Number(formatEther(balanceWei));
  const usdValue = balance * usdPrice;

  return {
    address: normalizedAddress,
    balance,
    usdPrice,
    usdValue,
  };
});

export async function getEthBalance(address: string): Promise<{
  address: Address;
  balance: number;
  usdPrice: number;
  usdValue: number;
}> {
  const normalizedAddress = normalizeAddressOrThrow(address);
  return getEthBalanceCached(normalizedAddress);
}

const getTokenBalancesCached = cache(async (normalizedAddress: Address) => {
  // Fetch only tracked balances first, then hydrate with live prices.
  const tracked = await getTrackedTokenBalances(normalizedAddress, {});
  const trackedPrices = await getTokenUsdPrices(tracked.map((token) => token.address));

  return tracked
    .map((token) => {
      const usdPrice = trackedPrices[token.address.toLowerCase()] ?? token.usdPrice;
      return {
        ...token,
        usdPrice,
        usdValue: token.balance * usdPrice,
      };
    })
    .sort((a, b) => b.usdValue - a.usdValue);
});

export async function getTokenBalances(address: string) {
  const normalizedAddress = normalizeAddressOrThrow(address);
  return getTokenBalancesCached(normalizedAddress);
}

const getLiquidityPositionsCached = cache(async (normalizedAddress: Address) => {
  // Single on-chain pass, then hydrate USD prices in-memory.
  const [v2Raw, v3Raw] = await Promise.all([
    getUniswapV2Positions(normalizedAddress, {}),
    getUniswapV3Positions(normalizedAddress, {}),
  ]);

  const liquidityTokenAddresses = collectUniqueTokenAddresses([], v2Raw, v3Raw);
  const prices = await getTokenUsdPrices(liquidityTokenAddresses);
  const v2Positions = applyTokenPricesToV2Positions(v2Raw, prices);
  const v3Positions = applyTokenPricesToV3Positions(v3Raw, prices);

  const allPositions = [...v2Positions, ...v3Positions].sort(
    (a, b) => b.totalUsd - a.totalUsd,
  );
  const totalUsd = allPositions.reduce((sum, position) => sum + position.totalUsd, 0);

  return {
    address: normalizedAddress,
    positions: allPositions,
    totalUsd,
  };
});

export async function getLiquidityPositions(address: string) {
  const normalizedAddress = normalizeAddressOrThrow(address);
  return getLiquidityPositionsCached(normalizedAddress);
}

const getPortfolioCached = cache(async (normalizedAddress: Address): Promise<PortfolioResponse> => {
  const [eth, tokens, liquidity] = await Promise.all([
    getEthBalanceCached(normalizedAddress),
    getTokenBalancesCached(normalizedAddress),
    getLiquidityPositionsCached(normalizedAddress),
  ]);

  const tokenTotalUsd = tokens.reduce((sum, token) => sum + token.usdValue, 0);

  return {
    address: normalizedAddress,
    totalUsd: eth.usdValue + tokenTotalUsd + liquidity.totalUsd,
    eth: {
      balance: eth.balance,
      usdPrice: eth.usdPrice,
      usdValue: eth.usdValue,
    },
    tokens,
    liquidityPositions: liquidity.positions,
    updatedAt: new Date().toISOString(),
  };
});

export async function getPortfolio(address: string): Promise<PortfolioResponse> {
  const normalizedAddress = normalizeAddressOrThrow(address);
  return getPortfolioCached(normalizedAddress);
}
