# Web3 Portfolio Dashboard (MVP)

Production-ready MVP dashboard for Ethereum portfolios:
- Native ETH balance and USD valuation
- Tracked ERC-20 token balances and USD valuation
- Uniswap V2/V3 liquidity positions with strict math-based valuation

## Deploy Link

- Live app: [https://telefy.uk](https://telefy.uk)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- viem (on-chain calls)
- Alchemy SDK (token balances)

## Features

- **ETH Module**
  - Reads native ETH via RPC
  - Converts to USD using live price feeds

- **ERC-20 Module**
  - Aggregates tracked tokens with Alchemy Token API
  - Fallback on-chain reads when needed
  - Calculates per-token USD and total USD

- **Uniswap V2 Module**
  - Uses LP ownership share:
    - `userShare = lpBalance / totalSupply`
    - `amount0 = userShare * reserve0`
    - `amount1 = userShare * reserve1`
  - Converts both token amounts to USD

- **Uniswap V3 Module (Strict Math)**
  - Scans position NFTs from `NonfungiblePositionManager`
  - Reads `positions(tokenId)`, pool `slot0()`, ticks and liquidity
  - Implements strict formulas:
    - `sqrtPrice = sqrtPriceX96 / 2^96`
    - `sqrtLower = sqrt(1.0001^tickLower)`
    - `sqrtUpper = sqrt(1.0001^tickUpper)`
    - branch logic for below/in/above range
  - Includes `tokensOwed0`/`tokensOwed1` in final amounts

- **API Endpoints**
  - `GET /portfolio/{address}`
  - `GET /balance/eth/{address}`
  - `GET /balance/tokens/{address}`
  - `GET /liquidity/{address}`
  - `GET /health`
  - Compatibility aliases under `/api/*` are also available.

- **UI/UX**
  - Light/dark themes
  - EN/RU language switch
  - Streaming modules with skeleton states
  - Onboarding walkthrough
  - Token/network logos

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:

```env
RPC_URL=https://ethereum.publicnode.com
ALCHEMY_API_KEY=
MAX_V3_POSITIONS_TO_SCAN=30
MAX_V3_SCAN_TIME_MS=8000
```

Security notes:
- Never commit `.env*` files (except `.env.example`)
- Keep API keys only in local/server env files

## How to Run (Local)

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

4. Open:

`http://localhost:3000`

## How to Run (Docker)

Build image:

```bash
docker build -t telefy-portfolio .
```

Run container:

```bash
docker run --env-file .env.local -p 3000:3000 telefy-portfolio
```

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Test Addresses (with Uniswap activity)

- `0x1D355CC3fe9A365DdD7Eb9e65B969895c35A37BC`
- `0x514C52CfD8Db898A95FDCEccBEe6e6556945630E`
- `0x615a681176023BFC4CFa94932f39ED7E8b0A5432`

These are public on-chain addresses provided only for functional validation and demo purposes. No private keys or sensitive credentials are included in this repository.
