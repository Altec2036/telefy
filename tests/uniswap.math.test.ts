import { describe, expect, it } from "vitest";
import { parseUnits } from "viem";
import {
  calculateAmountAndUsd,
  calculateV2Position,
  calculateV3AmountsStrict,
} from "@/lib/server/uniswap";

describe("Uniswap V2 math", () => {
  it("calculates user share and token amounts from LP balance", () => {
    const lpBalance = 10n;
    const totalSupply = 1000n;
    const reserve0 = 5_000_000n * 1_000_000n; // USDC (6)
    const reserve1 = 2_500n * 10n ** 18n; // ETH (18)

    const result = calculateV2Position(lpBalance, totalSupply, reserve0, reserve1);

    expect(result.userShare.toNumber()).toBeCloseTo(0.01, 12);
    expect(result.amount0Raw).toBe(50_000n * 1_000_000n);
    expect(result.amount1Raw).toBe(25n * 10n ** 18n);
  });
});

describe("Uniswap V3 strict formulas", () => {
  const q96 = 2n ** 96n;

  it("below range: amount0 > 0 and amount1 = 0", () => {
    const result = calculateV3AmountsStrict(1_000_000n, 0, 100, -1, q96);
    expect(result.inRange).toBe(false);
    expect(result.amount0Raw).toBeGreaterThan(0n);
    expect(result.amount1Raw).toBe(0n);
  });

  it("in range: amount0 > 0 and amount1 > 0", () => {
    const result = calculateV3AmountsStrict(1_000_000n, -100, 100, 0, q96);
    expect(result.inRange).toBe(true);
    expect(result.amount0Raw).toBeGreaterThan(0n);
    expect(result.amount1Raw).toBeGreaterThan(0n);
  });

  it("above range: amount0 = 0 and amount1 > 0", () => {
    const result = calculateV3AmountsStrict(1_000_000n, 0, 100, 101, q96);
    expect(result.inRange).toBe(false);
    expect(result.amount0Raw).toBe(0n);
    expect(result.amount1Raw).toBeGreaterThan(0n);
  });

  it("does not break on large liquidity values", () => {
    const result = calculateV3AmountsStrict(
      340282366920938463463374607431768211455n,
      -887000,
      887000,
      0,
      q96,
    );
    expect(result.amount0Raw).toBeGreaterThanOrEqual(0n);
    expect(result.amount1Raw).toBeGreaterThanOrEqual(0n);
  });
});

describe("Decimals before USD conversion", () => {
  it("handles USDC 6 decimals correctly", () => {
    const usdcRaw = parseUnits("2160.25", 6);
    const usdPrice = 1;
    const result = calculateAmountAndUsd(usdcRaw, 6, usdPrice);

    expect(result.amount).toBeCloseTo(2160.25, 6);
    expect(result.usdValue).toBeCloseTo(2160.25, 6);
  });

  it("handles ETH 18 decimals correctly", () => {
    const ethRaw = parseUnits("0.45", 18);
    const usdPrice = 3600;
    const result = calculateAmountAndUsd(ethRaw, 18, usdPrice);

    expect(result.amount).toBeCloseTo(0.45, 12);
    expect(result.usdValue).toBeCloseTo(1620, 8);
  });
});
