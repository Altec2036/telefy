import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/server/portfolio";

type RouteContext = {
  params: Promise<{ address: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params;

  try {
    const data = await getPortfolio(address);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown portfolio error";
    const status = message.includes("Invalid Ethereum address") ? 400 : 500;
    return NextResponse.json(
      {
        error: message,
      },
      { status },
    );
  }
}
