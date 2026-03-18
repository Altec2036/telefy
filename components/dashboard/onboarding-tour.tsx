"use client";

import { useEffect, useMemo, useState } from "react";
import { driver } from "driver.js";
import { I18N, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "telefy-onboarding-completed-v1";

type OnboardingTourProps = {
  enabled: boolean;
  lang: Lang;
};

export function OnboardingTour({ enabled, lang }: OnboardingTourProps) {
  const t = I18N[lang];
  const [openPrompt, setOpenPrompt] = useState(false);

  const tour = useMemo(
    () =>
      driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: "rgba(17, 24, 39, 0.7)",
        popoverClass: "telefy-tour-popover",
        nextBtnText: t.next,
        prevBtnText: t.prev,
        doneBtnText: t.done,
        steps: [
          {
            element: "[data-tour-id='address-form']",
            popover: {
              title: t.tourAddressTitle,
              description: t.tourAddressDesc,
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "[data-tour-id='summary-card']",
            popover: {
              title: t.tourSummaryTitle,
              description: t.tourSummaryDesc,
              side: "bottom",
              align: "center",
            },
          },
          {
            element: "[data-tour-id='tokens-section']",
            popover: {
              title: t.tourTokensTitle,
              description: t.tourTokensDesc,
              side: "top",
              align: "start",
            },
          },
          {
            element: "[data-tour-id='uniswap-section']",
            popover: {
              title: t.tourLiquidityTitle,
              description: t.tourLiquidityDesc,
              side: "top",
              align: "start",
            },
          },
        ],
        onDestroyed: () => {
          window.localStorage.setItem(STORAGE_KEY, "1");
        },
      }),
    [t],
  );

  useEffect(() => {
    if (!enabled) return;
    const completed = window.localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = window.setTimeout(() => setOpenPrompt(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, [enabled]);

  if (!openPrompt) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-xl">
      <p className="text-sm font-semibold text-[var(--text-main)]">{t.startTourTitle}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {t.startTourDesc}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "1");
            setOpenPrompt(false);
          }}
          type="button"
        >
          {t.skip}
        </button>
        <button
          className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_10px_30px_rgba(124,58,237,0.45)]"
          onClick={() => {
            setOpenPrompt(false);
            window.setTimeout(() => tour.drive(), 120);
          }}
          type="button"
        >
          {t.startTour}
        </button>
      </div>
    </div>
  );
}
