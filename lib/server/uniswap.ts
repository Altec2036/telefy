import Decimal from "decimal.js";
import { formatUnits, getAddress, zeroAddress, type Address } from "viem";
import {
  uniswapV2PairAbi,
  uniswapV3FactoryAbi,
  uniswapV3PoolAbi,
  uniswapV3PositionManagerAbi,
} from "@/lib/server/abis";
import { publicClient } from "@/lib/server/clients";
import {
  KNOWN_UNISWAP_V2_PAIRS,
  UNISWAP_V3_FACTORY_ADDRESS,
  UNISWAP_V3_POSITION_MANAGER_ADDRESS,
} from "@/lib/server/constants";
import { getTokenInfo } from "@/lib/server/tokens";
import type { V2LiquidityPosition, V3LiquidityPosition } from "@/lib/types";

Decimal.set({ precision: 80, rounding: Decimal.ROUND_DOWN });
const Q96 = new Decimal(2).pow(96);
const MAX_V3_POSITIONS_TO_SCAN = Number(
  process.env.MAX_V3_POSITIONS_TO_SCAN ?? "30",
);
const MAX_V3_SCAN_TIME_MS = Number(process.env.MAX_V3_SCAN_TIME_MS ?? "8000");

type V3MathResult = {
  amount0Raw: bigint;
  amount1Raw: bigint;
  inRange: boolean;
};

type V2MathResult = {
  userShare: Decimal;
  amount0Raw: bigint;
  amount1Raw: bigint;
};

function decimalToRawBigInt(value: Decimal): bigint {
  if (!value.isFinite() || value.lte(0)) return 0n;
  return BigInt(value.floor().toFixed(0));
}

export function calculateV2Position(
  lpBalance: bigint,
  totalSupply: bigint,
  reserve0: bigint,
  reserve1: bigint,
): V2MathResult {
  if (totalSupply === 0n) {
    return {
      userShare: new Decimal(0),
      amount0Raw: 0n,
      amount1Raw: 0n,
    };
  }

  const userShare = new Decimal(lpBalance.toString()).div(totalSupply.toString());
  const amount0Raw = (reserve0 * lpBalance) / totalSupply;
  const amount1Raw = (reserve1 * lpBalance) / totalSupply;

  return {
    userShare,
    amount0Raw,
    amount1Raw,
  };
}

export function calculateAmountAndUsd(
  amountRaw: bigint,
  decimals: number,
  usdPrice: number,
): { amount: number; usdValue: number } {
  const amount = Number(formatUnits(amountRaw, decimals));
  return {
    amount,
    usdValue: amount * usdPrice,
  };
}

export function calculateV3AmountsStrict(
  liquidity: bigint,
  tickLower: number,
  tickUpper: number,
  currentTick: number,
  sqrtPriceX96: bigint,
): V3MathResult {
  const L = new Decimal(liquidity.toString());
  // sqrtPrice = sqrtPriceX96 / 2^96 (strict from spec)
  const sqrtPrice = new Decimal(sqrtPriceX96.toString()).div(Q96);
  // sqrt(1.0001^tick) === 1.0001^(tick/2)
  const sqrtLower = new Decimal(1.0001).pow(new Decimal(tickLower).div(2));
  const sqrtUpper = new Decimal(1.0001).pow(new Decimal(tickUpper).div(2));

  if (currentTick < tickLower) {
    const amount0 = L.mul(sqrtUpper.minus(sqrtLower)).div(
      sqrtLower.mul(sqrtUpper),
    );
    return {
      amount0Raw: decimalToRawBigInt(amount0),
      amount1Raw: 0n,
      inRange: false,
    };
  }

  if (currentTick <= tickUpper) {
    const amount0 = L.mul(sqrtUpper.minus(sqrtPrice)).div(
      sqrtPrice.mul(sqrtUpper),
    );
    const amount1 = L.mul(sqrtPrice.minus(sqrtLower));
    return {
      amount0Raw: decimalToRawBigInt(amount0),
      amount1Raw: decimalToRawBigInt(amount1),
      inRange: true,
    };
  }

  const amount1 = L.mul(sqrtUpper.minus(sqrtLower));
  return {
    amount0Raw: 0n,
    amount1Raw: decimalToRawBigInt(amount1),
    inRange: false,
  };
}

export async function getUniswapV2Positions(
  userAddress: Address,
  tokenUsdPrices: Record<string, number>,
): Promise<V2LiquidityPosition[]> {
  const positions: V2LiquidityPosition[] = [];

  for (const pair of KNOWN_UNISWAP_V2_PAIRS) {
    const pairAddress = getAddress(pair.address);
    const [lpBalance, totalSupply, reserves, token0Address, token1Address] =
      await Promise.all([
        publicClient.readContract({
          address: pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "balanceOf",
          args: [userAddress],
        }),
        publicClient.readContract({
          address: pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "totalSupply",
        }),
        publicClient.readContract({
          address: pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "getReserves",
        }),
        publicClient.readContract({
          address: pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "token0",
        }),
        publicClient.readContract({
          address: pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "token1",
        }),
      ]);

    if (lpBalance === 0n || totalSupply === 0n) continue;

    const token0Info = await getTokenInfo(token0Address);
    const token1Info = await getTokenInfo(token1Address);

    const { userShare, amount0Raw, amount1Raw } = calculateV2Position(
      lpBalance,
      totalSupply,
      BigInt(reserves[0]),
      BigInt(reserves[1]),
    );

    const token0Price = tokenUsdPrices[token0Info.address.toLowerCase()] ?? 0;
    const token1Price = tokenUsdPrices[token1Info.address.toLowerCase()] ?? 0;

    const token0Calculated = calculateAmountAndUsd(
      amount0Raw,
      token0Info.decimals,
      token0Price,
    );
    const token1Calculated = calculateAmountAndUsd(
      amount1Raw,
      token1Info.decimals,
      token1Price,
    );

    positions.push({
      protocol: "uniswap_v2",
      poolAddress: pairAddress,
      poolLabel: pair.label,
      lpBalance: Number(formatUnits(lpBalance, 18)),
      sharePercent: userShare.mul(100).toNumber(),
      token0: {
        address: token0Info.address,
        symbol: token0Info.symbol,
        amount: token0Calculated.amount,
        usdPrice: token0Price,
        usdValue: token0Calculated.usdValue,
      },
      token1: {
        address: token1Info.address,
        symbol: token1Info.symbol,
        amount: token1Calculated.amount,
        usdPrice: token1Price,
        usdValue: token1Calculated.usdValue,
      },
      totalUsd: token0Calculated.usdValue + token1Calculated.usdValue,
    });
  }

  return positions;
}

export async function getUniswapV3Positions(
  userAddress: Address,
  tokenUsdPrices: Record<string, number>,
): Promise<V3LiquidityPosition[]> {
  const manager = getAddress(UNISWAP_V3_POSITION_MANAGER_ADDRESS);
  const factory = getAddress(UNISWAP_V3_FACTORY_ADDRESS);

  const nftCount = await publicClient.readContract({
    address: manager,
    abi: uniswapV3PositionManagerAbi,
    functionName: "balanceOf",
    args: [userAddress],
  });

  const positions: V3LiquidityPosition[] = [];
  const maxScanCount = BigInt(Math.max(1, MAX_V3_POSITIONS_TO_SCAN));
  const scanUpperBound = nftCount < maxScanCount ? nftCount : maxScanCount;
  const scanStartedAt = Date.now();

  for (let index = 0n; index < scanUpperBound; index += 1n) {
    if (Date.now() - scanStartedAt > MAX_V3_SCAN_TIME_MS) {
      break;
    }

    const tokenId = await publicClient.readContract({
      address: manager,
      abi: uniswapV3PositionManagerAbi,
      functionName: "tokenOfOwnerByIndex",
      args: [userAddress, index],
    });

    const pos = await publicClient.readContract({
      address: manager,
      abi: uniswapV3PositionManagerAbi,
      functionName: "positions",
      args: [tokenId],
    });

    if (pos[7] === 0n && pos[10] === 0n && pos[11] === 0n) continue;

    const token0 = getAddress(pos[2]);
    const token1 = getAddress(pos[3]);
    const feeTier = Number(pos[4]);
    const tickLower = Number(pos[5]);
    const tickUpper = Number(pos[6]);
    const liquidity = pos[7];
    const owed0Raw = pos[10];
    const owed1Raw = pos[11];

    const poolAddress = await publicClient.readContract({
      address: factory,
      abi: uniswapV3FactoryAbi,
      functionName: "getPool",
      args: [token0, token1, feeTier],
    });

    if (poolAddress === zeroAddress) continue;

    const slot0 = await publicClient.readContract({
      address: poolAddress,
      abi: uniswapV3PoolAbi,
      functionName: "slot0",
    });

    const currentTick = Number(slot0[1]);
    const sqrtPriceX96 = slot0[0];
    const { amount0Raw, amount1Raw, inRange } = calculateV3AmountsStrict(
      liquidity,
      tickLower,
      tickUpper,
      currentTick,
      sqrtPriceX96,
    );

    const token0Info = await getTokenInfo(token0);
    const token1Info = await getTokenInfo(token1);

    const total0Raw = amount0Raw + BigInt(owed0Raw);
    const total1Raw = amount1Raw + BigInt(owed1Raw);

    const token0Price = tokenUsdPrices[token0.toLowerCase()] ?? 0;
    const token1Price = tokenUsdPrices[token1.toLowerCase()] ?? 0;

    const token0Calculated = calculateAmountAndUsd(
      total0Raw,
      token0Info.decimals,
      token0Price,
    );
    const token1Calculated = calculateAmountAndUsd(
      total1Raw,
      token1Info.decimals,
      token1Price,
    );

    positions.push({
      protocol: "uniswap_v3",
      tokenId: tokenId.toString(),
      poolAddress,
      feeTier,
      inRange,
      token0: {
        address: token0Info.address,
        symbol: token0Info.symbol,
        amount: token0Calculated.amount,
        usdPrice: token0Price,
        usdValue: token0Calculated.usdValue,
      },
      token1: {
        address: token1Info.address,
        symbol: token1Info.symbol,
        amount: token1Calculated.amount,
        usdPrice: token1Price,
        usdValue: token1Calculated.usdValue,
      },
      feesEarned: {
        token0: Number(formatUnits(owed0Raw, token0Info.decimals)),
        token1: Number(formatUnits(owed1Raw, token1Info.decimals)),
      },
      totalUsd: token0Calculated.usdValue + token1Calculated.usdValue,
    });
  }

  return positions.sort((a, b) => b.totalUsd - a.totalUsd);
}
