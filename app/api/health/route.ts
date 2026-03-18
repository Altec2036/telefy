import { NextResponse } from "next/server";
import { publicClient } from "@/lib/server/clients";

export async function GET() {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    return NextResponse.json({
      status: "ok",
      rpc: "reachable",
      blockNumber: blockNumber.toString(),
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        rpc: "unreachable",
      },
      { status: 503 },
    );
  }
}
