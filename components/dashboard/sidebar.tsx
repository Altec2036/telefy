import { BarChart3, ChartPie, Droplets, Wallet } from "lucide-react";
import Image from "next/image";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { I18N, type Lang } from "@/lib/i18n";
import { ETHEREUM_LOGO_URL } from "@/lib/token-assets";

type SidebarProps = {
  lang: Lang;
};

export function Sidebar({ lang }: SidebarProps) {
  const t = I18N[lang];
  const navItems = [
    {
      label: t.dashboard,
      icon: BarChart3,
      href: "#dashboard",
      description: lang === "ru" ? "Общий баланс и сводка" : "Total balance and overview",
      active: true,
    },
    {
      label: t.eth,
      icon: Wallet,
      href: "#eth",
      description: lang === "ru" ? "Нативный баланс ETH" : "Native ETH balance",
      active: false,
    },
    {
      label: t.tokens,
      icon: ChartPie,
      href: "#erc20",
      description: lang === "ru" ? "Токены и USD оценка" : "Tokens and USD valuation",
      active: false,
    },
    {
      label: t.uniswap,
      icon: Droplets,
      href: "#uniswap",
      description: lang === "ru" ? "V2/V3 LP позиции" : "V2/V3 LP positions",
      active: false,
    },
  ];

  return (
    <aside
      className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl xl:block"
      data-tour-id="sidebar-nav"
    >
      <p className="mb-1 text-xs uppercase tracking-[0.22em] text-violet-400">TELEFY.UK</p>
      <p className="mb-6 text-xs text-[var(--text-soft)]">
        {t.sectionsHint}
      </p>
      <div className="mb-4 space-y-2">
        <LanguageSwitch className="w-full justify-center" />
        <ThemeToggle lightLabel={t.lightTheme} darkLabel={t.darkTheme} className="w-full justify-center" />
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={[
                "block rounded-xl border px-3 py-2 transition",
                item.active
                  ? "border-violet-400/45 bg-violet-500/10 text-[var(--text-muted)]"
                  : "border-[var(--card-border)] bg-black/5 text-[var(--text-muted)] hover:border-violet-400/20 hover:text-[var(--text-main)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Icon size={15} />
                <span>{item.label}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--text-soft)]">{item.description}</p>
            </a>
          );
        })}
      </nav>
      <div className="mt-8 rounded-xl border border-[var(--card-border)] bg-black/5 p-3">
        <p className="text-xs text-[var(--text-soft)]">{t.network}</p>
        <div className="mt-2 flex items-center gap-2">
          <Image
            src={ETHEREUM_LOGO_URL}
            alt="Ethereum logo"
            width={14}
            height={14}
            className="rounded-full border border-[var(--card-border)] bg-white/70 object-cover"
            loading="lazy"
          />
          <p className="text-sm text-[var(--text-main)]">{t.mainnet}</p>
        </div>
      </div>
    </aside>
  );
}
