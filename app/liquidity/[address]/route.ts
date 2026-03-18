import { NextResponse } from "next/server";
import { getLiquidityPositions } from "@/lib/server/portfolio";

type RouteContext = {
  params: Promise<{ address: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params;

  try {
    const liquidity = await getLiquidityPositions(address);
    return NextResponse.json(
      {
        address: liquidity.address,
        positions: liquidity.positions,
        totalUsd: liquidity.totalUsd,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown liquidity error";
    const status = message.includes("Invalid Ethereum address") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
