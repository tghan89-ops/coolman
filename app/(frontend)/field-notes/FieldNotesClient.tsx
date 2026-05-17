'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

// Honest row contract sent across the server boundary. snake_case mirrors
// Payload's storage; the rest is camelCase because the client only consumes
// derived view-model fields and never round-trips back to Payload.
export interface FieldNoteRow {
  id: string
  slug: string
  title: string
  titleBM: string | null
  excerpt: string | null
  excerptBM: string | null
  application: string | null
  applicationBM: string | null
  noteNumber: string | null
  readTimeMin: number | null
  publishedAt: string | null
  heroImageUrl: string | null
  heroImageAlt: string | null
}

interface FieldNotesClientProps {
  posts: FieldNoteRow[]
}

// Threshold for moving older notes into the Archive ribbon. Top of the index
// shows up to FEATURED_INDEX (1) + LIST_LIMIT (6), the rest collapses into a
// compact year-grouped strip. Tuneable here only — no business cost to changing.
const FEATURED_INDEX = 1
const LIST_LIMIT = 6

// Localised date format — matches Byline.tsx convention.
function formatDate(iso: string | null, lang: 'EN' | 'BM') {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(lang === 'BM' ? 'ms-MY' : 'en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function yearOf(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return String(date.getFullYear())
}

export function FieldNotesClient({ posts }: FieldNotesClientProps) {
  const { language, t } = useLanguage()
  const f = t.fieldNotes
  const idx = f.index

  // BM falls back to EN where the BM field is blank — same convention as the
  // rest of the public site.
  const titleFor = (p: FieldNoteRow) =>
    language === 'BM' ? p.titleBM || p.title : p.title
  const excerptFor = (p: FieldNoteRow) =>
    language === 'BM' ? p.excerptBM || p.excerpt || '' : p.excerpt || ''
  const applicationFor = (p: FieldNoteRow) =>
    language === 'BM' ? p.applicationBM || p.application || '' : p.application || ''

  // Filter chips are derived live from the posts' application strings — never
  // hardcoded. Stable order: alpha-by-EN application string.
  const applications = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of posts) {
      const tag = p.application?.trim()
      if (!tag) continue
      map.set(tag, (map.get(tag) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag))
  }, [posts])

  const [activeApp, setActiveApp] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!activeApp) return posts
    return posts.filter((p) => p.application === activeApp)
  }, [posts, activeApp])

  const featured = filtered.slice(0, FEATURED_INDEX)
  const list = filtered.slice(FEATURED_INDEX, FEATURED_INDEX + LIST_LIMIT)
  const archive = filtered.slice(FEATURED_INDEX + LIST_LIMIT)

  // Group archive by year for the ribbon. Reverse-chrono.
  const archiveByYear = useMemo(() => {
    const groups = new Map<string, FieldNoteRow[]>()
    for (const p of archive) {
      const year = yearOf(p.publishedAt) || '—'
      const arr = groups.get(year) ?? []
      arr.push(p)
      groups.set(year, arr)
    }
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [archive])

  // Years string used in the hero eyebrow. Empty list falls back to current year.
  const firstYear =
    posts.length > 0
      ? posts
          .map((p) => yearOf(p.publishedAt))
          .filter(Boolean)
          .sort()[0] ?? ''
      : ''

  return (
    <PublicLayout headerVariant="transparent">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {idx.eyebrowPrefix}
            {posts.length > 0 ? (
              <>
                {' · '}
                {posts.length} {idx.eyebrowPublishedSuffix}
                {firstYear ? (
                  <>
                    {' · '}
                    {idx.eyebrowSincePrefix} {firstYear}
                  </>
                ) : null}
              </>
            ) : null}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {f.indexHero.headline}
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
            {f.indexHero.lede}
          </p>
        </div>
      </section>

      {/* ── EMPTY STATE ──────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
            <div className="mx-auto flex max-w-[60ch] flex-col items-center text-center">
              <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                {idx.emptyHeadline}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">
                {idx.emptyBody}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ── FILTER BAR ─────────────────────────────────────── */}
          {applications.length >= 2 ? (
            <section className="bg-paper border-y border-rule">
              <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
                  <button
                    type="button"
                    onClick={() => setActiveApp(null)}
                    className={cn(
                      'font-mono text-[11px] uppercase tracking-[0.14em] py-1 transition-colors',
                      'border-b-2 border-transparent',
                      activeApp === null
                        ? 'text-accent border-accent'
                        : 'text-ink-muted hover:text-navy',
                    )}
                  >
                    {idx.filterAll}
                    <span className="ml-1.5 text-ink-faint">· {posts.length}</span>
                  </button>
                  {applications.map((a) => (
                    <button
                      key={a.tag}
                      type="button"
                      onClick={() => setActiveApp(a.tag)}
                      className={cn(
                        'font-mono text-[11px] uppercase tracking-[0.14em] py-1 transition-colors',
                        'border-b-2 border-transparent',
                        activeApp === a.tag
                          ? 'text-accent border-accent'
                          : 'text-ink-muted hover:text-navy',
                      )}
                    >
                      {a.tag}
                      <span className="ml-1.5 text-ink-faint">· {a.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* ── FEATURED NOTE ────────────────────────────────────── */}
          {featured.map((p) => {
            const href = `/field-notes/${p.slug}`
            return (
              <section key={p.id} className="bg-paper">
                <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
                  <article className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14 lg:items-center">
                    <Link
                      href={href}
                      className="group block"
                      aria-label={titleFor(p)}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary">
                        {p.heroImageUrl ? (
                          <Image
                            src={p.heroImageUrl}
                            alt={p.heroImageAlt || titleFor(p)}
                            fill
                            sizes="(min-width: 1024px) 55vw, 100vw"
                            className="object-cover grayscale transition-[filter,opacity] group-hover:grayscale-0"
                            priority
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                            {idx.eyebrowPrefix}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                        {idx.featuredBadge}
                        {p.noteNumber ? <span className="ml-3 text-ink-muted">{p.noteNumber}</span> : null}
                      </p>
                      <h2 className="mt-4 font-fraunces text-[clamp(28px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                        <Link href={href} className="transition-colors hover:text-accent">
                          {titleFor(p)}
                        </Link>
                      </h2>
                      {excerptFor(p) ? (
                        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-muted">
                          {excerptFor(p)}
                        </p>
                      ) : null}
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                        {applicationFor(p) ? <span className="text-ink-muted">{applicationFor(p)}</span> : null}
                        {p.publishedAt ? <span>{formatDate(p.publishedAt, language)}</span> : null}
                        {p.readTimeMin ? (
                          <span>
                            {p.readTimeMin} {f.article.readTimeUnit}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-8">
                        <Link
                          href={href}
                          className="inline-flex h-12 items-center rounded-md border border-navy bg-navy px-6 font-sans text-sm font-semibold text-paper transition-[background-color,box-shadow] hover:bg-navy-light hover:shadow-lg hover:shadow-navy/20"
                        >
                          {idx.readMore}
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            )
          })}

          {/* ── NOTES LIST ───────────────────────────────────────── */}
          {list.length > 0 ? (
            <section className="bg-paper border-t border-rule">
              <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-rule">
                  {list.map((p, i) => {
                    const href = `/field-notes/${p.slug}`
                    return (
                      <article
                        key={p.id}
                        className={cn(
                          'py-8 md:py-10',
                          i % 2 === 0 ? 'md:pr-8' : 'md:pl-8',
                          i >= 2 ? 'border-t border-rule md:border-t' : '',
                        )}
                      >
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                          {p.noteNumber ? <span className="text-accent">{p.noteNumber}</span> : null}
                          {p.noteNumber && applicationFor(p) ? <span className="mx-2">·</span> : null}
                          {applicationFor(p)}
                        </p>
                        <h3 className="mt-3 font-fraunces text-[clamp(22px,2.2vw,28px)] font-normal leading-[1.15] tracking-[-0.015em] text-navy">
                          <Link href={href} className="transition-colors hover:text-accent">
                            {titleFor(p)}
                          </Link>
                        </h3>
                        {excerptFor(p) ? (
                          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
                            {excerptFor(p)}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                          {p.publishedAt ? <span>{formatDate(p.publishedAt, language)}</span> : null}
                          {p.readTimeMin ? (
                            <span>
                              {p.readTimeMin} {f.article.readTimeUnit}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {/* ── ARCHIVE ──────────────────────────────────────────── */}
          {archiveByYear.length > 0 ? (
            <section className="bg-paper border-t border-rule">
              <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-20">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-fraunces text-[clamp(24px,2.4vw,32px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                    {idx.archiveHeading}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {idx.archiveHeadingNote}
                  </p>
                </div>
                <div className="mt-8 divide-y divide-rule">
                  {archiveByYear.map(([year, notes]) => (
                    <div
                      key={year}
                      className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[120px_1fr] md:gap-8"
                    >
                      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
                        {year}
                      </p>
                      <ul className="flex flex-col gap-3">
                        {notes.map((p) => (
                          <li key={p.id} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                            <Link
                              href={`/field-notes/${p.slug}`}
                              className="font-fraunces text-[17px] leading-snug text-navy transition-colors hover:text-accent"
                            >
                              {titleFor(p)}
                            </Link>
                            {applicationFor(p) ? (
                              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                                {applicationFor(p)}
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PublicLayout>
  )
}
