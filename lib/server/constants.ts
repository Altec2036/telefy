export const DEFAULT_RPC_URL = "https://ethereum.publicnode.com";

export const UNISWAP_V2_FACTORY_ADDRESS =
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const UNISWAP_V3_FACTORY_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const UNISWAP_V3_POSITION_MANAGER_ADDRESS =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const TRACKED_TOKEN_MAP: Record<
  string,
  { symbol: string; coingeckoId: string; decimals: number }
> = {
  "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    symbol: "USDC",
    coingeckoId: "usd-coin",
    decimals: 6,
  },
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
    symbol: "USDT",
    coingeckoId: "tether",
    decimals: 6,
  },
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    symbol: "WETH",
    coingeckoId: "weth",
    decimals: 18,
  },
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": {
    symbol: "DAI",
    coingeckoId: "dai",
    decimals: 18,
  },
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": {
    symbol: "LINK",
    coingeckoId: "chainlink",
    decimals: 18,
  },
};

export const TRACKED_TOKEN_ADDRESSES = Object.keys(TRACKED_TOKEN_MAP);

export const TRACKED_TOKEN_MAP_LOWER = Object.fromEntries(
  Object.entries(TRACKED_TOKEN_MAP).map(([address, meta]) => [
    address.toLowerCase(),
    meta,
  ]),
);

export const KNOWN_UNISWAP_V2_PAIRS = [
  {
    address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    label: "USDC/WETH",
  },
  {
    address: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    label: "DAI/WETH",
  },
  {
    address: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    label: "USDT/WETH",
  },
];
