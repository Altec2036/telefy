import { I18N, type Lang } from "@/lib/i18n";

type InvalidAddressProps = {
  value: string;
  lang: Lang;
};

export function InvalidAddress({ value, lang }: InvalidAddressProps) {
  const t = I18N[lang];
  return (
    <section className="rounded-2xl border border-rose-400/35 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-200 backdrop-blur-xl">
      <p className="text-sm font-medium">{t.invalidAddress}</p>
      <p className="mt-1 text-xs opacity-90">{value}</p>
      <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">
        {t.invalidAddressHint}
      </p>
    </section>
  );
}
