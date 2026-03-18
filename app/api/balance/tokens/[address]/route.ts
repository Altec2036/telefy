import { NextResponse } from "next/server";
import { getTokenBalances, normalizeAddressOrThrow } from "@/lib/server/portfolio";

type RouteContext = {
  params: Promise<{ address: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params;

  try {
    const normalizedAddress = normalizeAddressOrThrow(address);
    const tokens = await getTokenBalances(address);
    const totalUsd = tokens.reduce((sum, token) => sum + token.usdValue, 0);
    return NextResponse.json(
      {
        address: normalizedAddress,
        tokens,
        totalUsd,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown token balance error";
    const status = message.includes("Invalid Ethereum address") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
