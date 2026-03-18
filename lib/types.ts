export type TokenBalanceItem = {
  address: string;
  symbol: string;
  decimals: number;
  balance: number;
  usdPrice: number;
  usdValue: number;
};

export type AssetWithAmount = {
  address: string;
  symbol: string;
  amount: number;
  usdPrice: number;
  usdValue: number;
};

export type V2LiquidityPosition = {
  protocol: "uniswap_v2";
  poolAddress: string;
  poolLabel: string;
  lpBalance: number;
  sharePercent: number;
  token0: AssetWithAmount;
  token1: AssetWithAmount;
  totalUsd: number;
};

export type V3LiquidityPosition = {
  protocol: "uniswap_v3";
  tokenId: string;
  poolAddress: string;
  feeTier: number;
  inRange: boolean;
  token0: AssetWithAmount;
  token1: AssetWithAmount;
  feesEarned: {
    token0: number;
    token1: number;
  };
  totalUsd: number;
};

export type PortfolioResponse = {
  address: string;
  totalUsd: number;
  eth: {
    balance: number;
    usdPrice: number;
    usdValue: number;
  };
  tokens: TokenBalanceItem[];
  liquidityPositions: Array<V2LiquidityPosition | V3LiquidityPosition>;
  updatedAt: string;
};
