import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { DEFAULT_RPC_URL } from "@/lib/server/constants";

const rpcUrl = process.env.RPC_URL ?? DEFAULT_RPC_URL;

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrl),
});

export const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});
