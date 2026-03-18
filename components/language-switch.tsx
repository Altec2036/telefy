"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeLang, type Lang } from "@/lib/i18n";

type LanguageSwitchProps = {
  className?: string;
};

export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = normalizeLang(searchParams.get("lang"));

  const setLang = (nextLang: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={[
        "inline-flex items-center rounded-xl border border-[var(--card-border)] bg-black/5 p-1",
        className ?? "",
      ].join(" ")}
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          lang === "en"
            ? "bg-violet-500 text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
            : "text-[var(--text-muted)] hover:text-[var(--text-main)]",
        ].join(" ")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          lang === "ru"
            ? "bg-violet-500 text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
            : "text-[var(--text-muted)] hover:text-[var(--text-main)]",
        ].join(" ")}
      >
        RU
      </button>
    </div>
  );
}
