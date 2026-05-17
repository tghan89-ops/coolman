"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/context'
import { useSettings } from '@/lib/settings/context'

// Session 4 Part 3 shape: three columns + base bar. The footer is functional,
// not decorative — no social icons, no brand-story paragraph, no CTA block.
// Legal entity name comes from Settings (admin-editable) so a rename is a
// one-place edit, not a sweep across templates.

export function Footer() {
  const { t } = useLanguage()
  const { legal_entity_name } = useSettings()

  const columns = [
    t.footer.columns.reachCoolman,
    t.footer.columns.readAndLearn,
    t.footer.columns.catalogueAndTrade,
  ]

  const year = new Date().getFullYear()
  const distributorLine = t.footer.baseBar.distributorLineTemplate.replace(
    '{legalEntity}',
    legal_entity_name,
  )

  const legalLinkClass =
    'text-xs text-white/40 transition-colors hover:text-white/70'

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Brand mark — small, top-left. Functional, not decorative. */}
        <div className="mb-12">
          <Link
            href="/"
            aria-label="Coolman home"
            className="-mx-2 inline-flex h-11 items-center px-2"
          >
            <Image
              src="/brand/coolman-logo-white.svg"
              alt="Coolman"
              width={96}
              height={29}
              className="h-7 w-auto"
            />
          </Link>
        </div>

        {/* Three columns: Reach / Read & Learn / Catalogue & Trade */}
        <div className="grid gap-12 md:grid-cols-3">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-6 text-sm font-bold tracking-wide text-white">
                {col.heading}
              </h3>
              <ul className="space-y-4">
                {col.items.map((item) => (
                  <li key={`${col.heading}-${item.primary}-${item.href}`}>
                    <Link
                      href={item.href}
                      className="group block"
                    >
                      <span className="block text-sm text-white transition-colors group-hover:text-accent">
                        {item.primary}
                      </span>
                      <span className="mt-1 block text-xs text-white/50">
                        {item.secondary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Base bar — copyright + manufactured-in line, distributor line below,
            legal links inline. */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-white/50">
              <span className="font-mono">© {year}</span>{' '}
              {legal_entity_name} · {t.footer.baseBar.manufacturedIn} ·{' '}
              {t.footer.rightsReservedSuffix}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/privacy" className={legalLinkClass}>
                {t.footer.baseBar.legalLinks.privacy}
              </Link>
              <Link href="/terms" className={legalLinkClass}>
                {t.footer.baseBar.legalLinks.terms}
              </Link>
              <Link href="/returns-warranty" className={legalLinkClass}>
                {t.footer.baseBar.legalLinks.returns}
              </Link>
              <Link href="/cookies" className={legalLinkClass}>
                {t.footer.baseBar.legalLinks.cookies}
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40">{distributorLine}</p>
        </div>
      </div>
    </footer>
  )
}
