import { describe, expect, it } from "vitest";
import { GET as getPortfolioRoute } from "@/app/api/portfolio/[address]/route";
import { GET as getEthRoute } from "@/app/api/balance/eth/[address]/route";
import { GET as getTokensRoute } from "@/app/api/balance/tokens/[address]/route";
import { GET as getLiquidityRoute } from "@/app/api/liquidity/[address]/route";

const request = new Request("http://localhost");

describe("API routes - invalid address handling", () => {
  it("returns 400 for invalid portfolio address", async () => {
    const response = await getPortfolioRoute(request, {
      params: Promise.resolve({ address: "invalid" }),
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid ETH balance address", async () => {
    const response = await getEthRoute(request, {
      params: Promise.resolve({ address: "invalid" }),
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid tokens address", async () => {
    const response = await getTokensRoute(request, {
      params: Promise.resolve({ address: "invalid" }),
    });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid liquidity address", async () => {
    const response = await getLiquidityRoute(request, {
      params: Promise.resolve({ address: "invalid" }),
    });
    expect(response.status).toBe(400);
  });
});
