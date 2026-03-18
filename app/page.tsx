import { Suspense } from "react";
import { isAddress } from "viem";
import { LanguageSwitch } from "@/components/language-switch";
import { AddressForm } from "@/components/dashboard/address-form";
import { HeroBalanceCard } from "@/components/dashboard/hero-balance-card";
import { InvalidAddress } from "@/components/dashboard/invalid-address";
import { LiquidityModule } from "@/components/dashboard/liquidity-module";
import { LiquidCard } from "@/components/dashboard/liquid-card";
import { ModuleSkeleton } from "@/components/dashboard/module-skeleton";
import { OnboardingTour } from "@/components/dashboard/onboarding-tour";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SummaryModule } from "@/components/dashboard/summary-module";
import { ThemeToggle } from "@/components/theme-toggle";
import { TokensModule } from "@/components/dashboard/tokens-module";
import { MetricCard } from "@/components/dashboard/metric-card";
import { I18N, normalizeLang } from "@/lib/i18n";

type HomeProps = {
  searchParams: Promise<{ address?: string; lang?: string }>;
};

export const dynamic = "force-dynamic";

function demoSeries() {
  return Array.from({ length: 24 }, (_, idx) => {
    const phase = idx / 24;
    return 1000 * (0.95 + Math.sin(phase * Math.PI * 2.3) * 0.09 + phase * 0.14);
  });
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const lang = normalizeLang(params.lang);
  const t = I18N[lang];
  const address = params.address?.trim() ?? "";
  const hasAddress = address.length > 0;
  const validAddress = hasAddress && isAddress(address, { strict: false });

  return (
    <main className="min-h-screen text-[var(--text-main)]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-3 sm:p-4 lg:p-6 xl:flex-row">
        <Sidebar lang={lang} />
        <section className="w-full space-y-4">
          <header className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-400">TELEFY.UK</p>
              <div className="flex flex-wrap items-center justify-end gap-2 xl:hidden">
                <LanguageSwitch />
                <ThemeToggle lightLabel={t.lightTheme} darkLabel={t.darkTheme} />
              </div>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.siteName}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {t.description}
            </p>
            <div className="mt-4">
              <AddressForm lang={lang} />
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              <a
                href="#dashboard"
                className="rounded-lg border border-violet-400/35 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-700 dark:text-violet-200"
              >
                {t.dashboard}
              </a>
              <a
                href="#eth"
                className="rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                {t.eth}
              </a>
              <a
                href="#erc20"
                className="rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                {t.tokens}
              </a>
              <a
                href="#uniswap"
                className="rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-1.5 text-xs text-[var(--text-muted)]"
              >
                {t.uniswap}
              </a>
            </nav>
          </header>

          {!hasAddress ? (
            <div className="space-y-4">
              <section id="dashboard">
                <HeroBalanceCard
                  title={t.totalBalanceUsd}
                  value="∞"
                  subtitle={t.noAddressHint}
                  values={demoSeries()}
                  className="lg:col-span-2"
                />
              </section>
              <section id="eth">
                <MetricCard
                  title={`${t.eth} Balance`}
                  value="∞ ETH"
                  subtitle={t.noAddressHint}
                  trendPositive
                  sparkValues={demoSeries().slice(0, 18)}
                />
              </section>
              <section id="erc20" data-tour-id="tokens-section">
                <LiquidCard>
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">{t.tokens} Tokens</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {lang === "ru"
                      ? "Здесь появится список токенов и их USD оценка."
                      : "Token list with balances and USD valuation will appear here."}
                  </p>
                </LiquidCard>
              </section>
              <section id="uniswap" data-tour-id="uniswap-section">
                <LiquidCard>
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">
                    {t.uniswap} V2/V3
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {lang === "ru"
                      ? "Здесь будут LP позиции с расчетом стоимости и комиссий."
                      : "LP positions with valuation and earned fees will appear here."}
                  </p>
                </LiquidCard>
              </section>
            </div>
          ) : !validAddress ? (
            <InvalidAddress value={address} lang={lang} />
          ) : (
            <div className="space-y-4">
              <section id="dashboard">
                <Suspense
                  fallback={
                    <ModuleSkeleton
                      title={lang === "ru" ? "Загрузка сводки портфеля..." : "Loading portfolio summary..."}
                      rows={1}
                    />
                  }
                >
                  <SummaryModule address={address} lang={lang} />
                </Suspense>
              </section>

              <section id="erc20" data-tour-id="tokens-section">
                <Suspense
                  fallback={
                    <ModuleSkeleton
                      title={lang === "ru" ? "Загрузка ERC-20 токенов..." : "Loading ERC-20 tokens..."}
                      rows={4}
                    />
                  }
                >
                  <TokensModule address={address} lang={lang} />
                </Suspense>
              </section>

              <section id="uniswap" data-tour-id="uniswap-section">
                <Suspense
                  fallback={
                    <ModuleSkeleton
                      title={lang === "ru" ? "Загрузка Uniswap позиций..." : "Loading Uniswap positions..."}
                      rows={4}
                    />
                  }
                >
                  <LiquidityModule address={address} lang={lang} />
                </Suspense>
              </section>
            </div>
          )}
        </section>
      </div>
      <OnboardingTour enabled lang={lang} />
    </main>
  );
}
