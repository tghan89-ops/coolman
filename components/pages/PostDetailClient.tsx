'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import sanitizeHtml from 'sanitize-html'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { useLivePreview } from '@payloadcms/live-preview-react'

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
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
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

export function PostDetailClient({ post: initialPost }: { post: any }) {
  const { language, t } = useLanguage()
  const { data: post } = useLivePreview({
    initialData: initialPost,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }

  const title = pick(post?.title, post?.titleBM)
  const body = pick(post?.content, post?.contentBM)
  const hero =
    post?.heroImage && typeof post.heroImage === 'object' ? post.heroImage.url : null
  const heroAlt = post?.heroImage?.alt || title
  const date = post?.publishedAt || post?.createdAt
  const safeBody = body ? sanitizeHtml(body, SANITIZE_OPTIONS) : ''
  const dateStr = date
    ? new Date(date).toLocaleDateString(language === 'BM' ? 'ms-MY' : 'en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <PublicLayout>
      <article className="bg-white pb-24 pt-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.pages.resources.backToResources}
          </Link>

          <header className="mt-8">
            {dateStr ? (
              <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {t.pages.resources.publishedOn} <span>{dateStr}</span>
              </p>
            ) : null}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy lg:text-4xl">
              {title}
            </h1>
          </header>

          {hero ? (
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt={heroAlt} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div
            className="post-body mt-10"
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        </div>
      </article>
    </PublicLayout>
  )
}
