import { NextResponse } from "next/server";
import { getEthBalance } from "@/lib/server/portfolio";

type RouteContext = {
  params: Promise<{ address: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params;

  try {
    const eth = await getEthBalance(address);
    return NextResponse.json(
      {
        address: eth.address,
        eth: {
          balance: eth.balance,
          usdPrice: eth.usdPrice,
          usdValue: eth.usdValue,
        },
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ETH error";
    const status = message.includes("Invalid Ethereum address") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
