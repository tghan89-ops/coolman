'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import sanitizeHtml from 'sanitize-html'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { splitLeadParagraph } from '@/lib/field-notes/split-lead-paragraph'

// Sanitisation profile — same shape as the legacy /resources/[slug] template,
// kept here so the field-notes scope owns its own contract. If we later split
// post-body styling from generic prose, this is the boundary to tighten.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'strong', 'em', 'b', 'i', 'u',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'figure', 'figcaption', 'span', 'div',
    'cite',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    blockquote: ['cite'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    // External links always open in a new tab with rel="noopener noreferrer".
    // Mailto: keep target inline. Same convention used elsewhere in the app.
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer',
        target: attribs.target || '_blank',
      },
    }),
  },
}

interface RelatedProductRow {
  id: string | number
  slug?: string | null
  name?: string | null
  category?: string | null
  tagline?: string | null
}

interface FieldNotePost {
  id: string | number
  slug: string
  title?: string | null
  titleBM?: string | null
  excerpt?: string | null
  excerptBM?: string | null
  content?: string | null
  contentBM?: string | null
  application?: string | null
  applicationBM?: string | null
  noteNumber?: string | null
  readTimeMin?: number | null
  publishedAt?: string | null
  createdAt?: string | null
  heroImage?: { url?: string | null; alt?: string | null } | string | number | null
  relatedProducts?: Array<RelatedProductRow | string | number> | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
}

export function FieldNoteArticleClient({ post: initialPost }: { post: FieldNotePost }) {
  const { language, t } = useLanguage()
  const f = t.fieldNotes
  const a = f.article

  const { data: post } = useLivePreview<FieldNotePost>({
    initialData: initialPost,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }

  const title = pick(post?.title, post?.titleBM)
  const excerpt = pick(post?.excerpt, post?.excerptBM)
  const body = pick(post?.content, post?.contentBM)
  const application = pick(post?.application, post?.applicationBM)
  const date = post?.publishedAt || post?.createdAt
  const hero =
    post?.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const heroUrl = hero?.url || null
  const heroAlt = hero?.alt || title

  const safeBody = body ? sanitizeHtml(body, SANITIZE_OPTIONS) : ''
  const { lead, rest } = splitLeadParagraph(safeBody)

  const dateStr = date
    ? new Date(date).toLocaleDateString(language === 'BM' ? 'ms-MY' : 'en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // Defensive: filter relationship payload down to populated docs only. Bare
  // ids (numbers/strings) mean Payload didn't expand the relation — skip them
  // rather than render a broken card.
  const related: RelatedProductRow[] = (post?.relatedProducts || []).filter(
    (r): r is RelatedProductRow => typeof r === 'object' && r !== null && 'id' in r,
  )

  return (
    <PublicLayout headerVariant="transparent">
      <article>
        {/* ── ARTICLE HEAD ────────────────────────────────────── */}
        <header className="bg-navy text-paper">
          <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-28">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint"
            >
              <Link href="/" className="text-accent-light hover:text-paper">
                {a.breadcrumbHome}
              </Link>
              <span className="mx-2">/</span>
              <Link href="/field-notes" className="text-accent-light hover:text-paper">
                {a.breadcrumbFieldNotes}
              </Link>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {post?.noteNumber ? <span>{post.noteNumber}</span> : null}
              {application ? <span className="text-paper/80">{application}</span> : null}
              {post?.readTimeMin ? (
                <span>
                  {post.readTimeMin} {a.readTimeUnit}
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 max-w-[24ch] font-fraunces text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.025em] text-paper">
              {title}
            </h1>

            {excerpt ? (
              <p className="mt-8 max-w-[60ch] text-[19px] leading-[1.55] text-ink-faint">
                {excerpt}
              </p>
            ) : null}

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/10 pt-6">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[15px] text-paper">{f.byline}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {a.bylineLabel}
                </span>
              </div>
              {dateStr ? (
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[15px] text-paper">{dateStr}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {a.publishedLabel}
                  </span>
                </div>
              ) : null}
              {application ? (
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[15px] text-paper">{application}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {a.filedUnderLabel}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* ── HERO IMAGE (offset overlap) ──────────────────────── */}
        {heroUrl ? (
          <div className="bg-paper">
            <div className="mx-auto -mt-14 max-w-[1280px] px-6 lg:-mt-20 lg:px-8">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={heroUrl}
                  alt={heroAlt || title}
                  fill
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="object-cover grayscale"
                  priority
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── ARTICLE BODY ────────────────────────────────────── */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-[68ch]">
              {lead ? (
                <div
                  className="post-body post-body--field-note post-body--lead"
                  dangerouslySetInnerHTML={{ __html: lead }}
                />
              ) : null}
              {rest ? (
                <div
                  className="post-body post-body--field-note mt-4"
                  dangerouslySetInnerHTML={{ __html: rest }}
                />
              ) : null}
            </div>
          </div>
        </section>

        {/* ── RELATED PRODUCTS ────────────────────────────────── */}
        {related.length > 0 ? (
          <section className="bg-paper border-t border-rule">
            <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-20">
              <div className="max-w-[60ch]">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  {a.relatedHeading}
                </p>
                <p className="mt-3 font-fraunces text-[clamp(20px,2vw,26px)] leading-snug text-navy">
                  {a.relatedLede}
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => {
                  const href = r.slug ? `/products/${r.slug}` : null
                  const card = (
                    <div className="hover-card flex h-full flex-col gap-3 rounded-lg border border-rule bg-white p-6">
                      {r.category ? (
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                          {r.category}
                        </p>
                      ) : null}
                      <p className="font-fraunces text-[20px] leading-snug text-navy">
                        {r.name || r.slug || `#${r.id}`}
                      </p>
                      {r.tagline ? (
                        <p className="text-[14px] leading-relaxed text-ink-muted">{r.tagline}</p>
                      ) : null}
                    </div>
                  )
                  return href ? (
                    <Link key={String(r.id)} href={href} className="block">
                      {card}
                    </Link>
                  ) : (
                    <div key={String(r.id)}>{card}</div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── BACK LINK ───────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
            <Link
              href="/field-notes"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {a.back}
            </Link>
          </div>
        </section>
      </article>
    </PublicLayout>
  )
}
