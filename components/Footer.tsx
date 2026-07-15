"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 border-t border-[var(--border-subtle)] px-4 pb-8 pt-6 text-sm leading-6 text-[var(--text-muted)] sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
      <p className="max-w-3xl">
        {t("footer.disclaimer")}
      </p>
      <div className="flex flex-wrap gap-4 font-bold text-[var(--text-secondary)] max-sm:w-full max-sm:justify-between">
        <Link href="/about">{t("footer.about")}</Link>
        <Link href="/faq">{t("footer.faq")}</Link>
        <Link href="/privacy">{t("footer.privacy")}</Link>
        <Link href="/terms">{t("footer.terms")}</Link>
        <Link href="/contact">{t("footer.contact")}</Link>
        <Link href="/report">{t("footer.report")}</Link>
      </div>
    </footer>
  );
}
