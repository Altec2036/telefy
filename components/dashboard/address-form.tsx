"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { I18N, type Lang } from "@/lib/i18n";

type AddressFormProps = {
  lang: Lang;
};

export function AddressForm({ lang }: AddressFormProps) {
  const t = I18N[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAddress = searchParams.get("address") ?? "";
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = address.trim();
    if (!isAddress(trimmed, { strict: false })) {
      setError(t.invalidAddressHint);
      return;
    }

    setError(null);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("address", trimmed);
      params.set("lang", lang);
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2" data-tour-id="address-form">
      <div className="flex flex-col gap-3 xl:flex-row">
        <Input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={t.enterAddress}
        />
        <Button
          type="submit"
          disabled={pending}
        >
          {pending ? t.loading : t.showPortfolio}
        </Button>
      </div>
      <p className="text-xs text-[var(--text-soft)]">
        {t.noAddressHint}
      </p>
      {error && <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>}
    </form>
  );
}
