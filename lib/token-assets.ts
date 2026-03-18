export const ETHEREUM_LOGO_URL =
  "https://assets.coingecko.com/coins/images/279/large/ethereum.png";

const TRUSTWALLET_ETH_ASSET_BASE =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets";

export function getTokenLogoUrl(address: string): string {
  return `${TRUSTWALLET_ETH_ASSET_BASE}/${address}/logo.png`;
}
