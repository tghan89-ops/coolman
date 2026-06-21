/**
 * Puck configuration — the block palette for Coolman's visual pages.
 *
 * Isomorphic: render functions are pure (props -> JSX, no client-only hooks) so
 * this config is safe to import from both the editor (client) and the server
 * <Render> path. Field renders (e.g. MediaField) only execute in the editor.
 *
 * Mechanics used here:
 *  - inline click-to-type  → text/textarea fields with contentEditable: true.
 *    Works on top-level fields AND inside array sub-fields (Stats/FAQ/Steps),
 *    because Puck's inline transform walks the prop path. Render the prop
 *    directly ({prop}) so the editor can inject the editable node.
 *  - column drop-zones      → slot fields rendered as <Slot />
 *  - scale-step styling     → selects mapped to DESIGN.md tokens (puck/styleTokens)
 *  - in-place media          → custom MediaField (upload / drag-drop / library)
 *
 * Brand safety (DESIGN.md): every visual choice is a curated step; no raw
 * px/hex/font inputs; Fraunces stays editorial-hero only; single accent; mono on
 * numbers; no icon-circle 3-col grids / centered-everything / emoji-as-UI.
 * No product/price/catalogue block is exposed here (CLAUDE.md two-tier rule).
 */
import type { Config } from '@puckeditor/core'
import { MediaField, type MediaValue } from './fields/MediaField'
import { LinkField } from './fields/LinkField'
import { homeBlocks, homeBlockNames } from './blocks/home'
import { pageBlocks, pageBlockNames } from './blocks/pages'
import {
  headingSizeOptions, headingSizeClass, type HeadingSize,
  textSizeOptions, textSizeClass, type TextSize,
  colorOptions, textColorClass, type ColorToken,
  spacingOptions, spacingClass, type Spacing,
  alignOptions, alignClass, type Align,
  surfaceOptions, surfaceClass, type Surface,
  cx,
} from './styleTokens'

const container = 'mx-auto w-full max-w-7xl px-6 lg:px-8'

// Reusable scale-step style fields shared across blocks.
const styleFields = {
  color: { type: 'select' as const, label: 'Colour', options: colorOptions },
  align: { type: 'select' as const, label: 'Alignment', options: alignOptions },
}

// Link picker (choose a built page) shared by every block with a button/link.
const linkField = (label: string) =>
  ({
    type: 'custom' as const,
    label,
    render: ({ onChange, value }: { onChange: (v: string) => void; value: unknown }) => (
      <LinkField value={value as string} onChange={onChange} />
    ),
  })

// Button look (curated variants — no raw colour picker).
const buttonVariantOptions = [
  { label: 'Primary (accent)', value: 'primary' },
  { label: 'Solid (navy)', value: 'navy' },
  { label: 'Outline', value: 'outline' },
] as const
type ButtonVariant = (typeof buttonVariantOptions)[number]['value']
const buttonClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:opacity-90',
  navy: 'bg-navy text-white hover:opacity-90',
  outline: 'border border-navy text-navy hover:bg-navy hover:text-white',
}
const buttonBase =
  'inline-flex h-12 items-center justify-center rounded-[5px] px-6 font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-[opacity,background-color,color] duration-150'

// Column split presets. Values are span counts on a 12-track grid (sum = 12) so
// the editor picks a width RATIO per column (e.g. 60/40) without typing raw
// percentages — stays on the scale-step model and always stacks on mobile.
const columnLayoutOptions = [
  { label: '2 columns · 50 / 50', value: '6-6' },
  { label: '2 columns · 60 / 40', value: '7-5' },
  { label: '2 columns · 40 / 60', value: '5-7' },
  { label: '2 columns · 67 / 33', value: '8-4' },
  { label: '2 columns · 33 / 67', value: '4-8' },
  { label: '2 columns · 75 / 25', value: '9-3' },
  { label: '2 columns · 25 / 75', value: '3-9' },
  { label: '3 columns · equal', value: '4-4-4' },
  { label: '3 columns · 50 / 25 / 25', value: '6-3-3' },
  { label: '3 columns · 25 / 50 / 25', value: '3-6-3' },
  { label: '3 columns · 25 / 25 / 50', value: '3-3-6' },
] as const
// Literal classes so Tailwind's scanner keeps them.
const colSpanClass: Record<string, string> = {
  '3': 'md:col-span-3',
  '4': 'md:col-span-4',
  '5': 'md:col-span-5',
  '6': 'md:col-span-6',
  '7': 'md:col-span-7',
  '8': 'md:col-span-8',
  '9': 'md:col-span-9',
}

// Image size = % of the content width on desktop; always full-width on mobile so
// small images never become unreadably tiny on a phone (scale-step model).
const imageSizeOptions = [
  { label: '25%', value: '25' },
  { label: '33%', value: '33' },
  { label: '50%', value: '50' },
  { label: '66%', value: '67' },
  { label: '75%', value: '75' },
  { label: '100% (full)', value: '100' },
] as const
const imageWidthClass: Record<string, string> = {
  '25': 'md:w-1/4',
  '33': 'md:w-1/3',
  '50': 'md:w-1/2',
  '67': 'md:w-2/3',
  '75': 'md:w-3/4',
  '100': 'md:w-full',
}
const imageAlignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
] as const
const imageAlignClass: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
}
const captionAlignClass: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

function ButtonLink({ label, href, variant }: { label?: React.ReactNode; href?: string; variant?: ButtonVariant }) {
  if (!label) return null
  return (
    <a href={(href as string) || '#'} className={cx(buttonBase, buttonClass[variant || 'primary'])}>
      {label}
    </a>
  )
}

// Parse a YouTube / Vimeo URL into an embeddable src. Pure (server-safe).
function embedSrc(url?: string): string | null {
  if (!url) return null
  const u = url.trim()
  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

export const config: Config = {
  // Root: page-level wrapper (optional title used for editor only).
  root: {
    fields: {
      title: { type: 'text', label: 'Page title (internal)' },
    },
    render: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  },

  components: {
    // ============ CONTENT ============

    // ---------- Heading (inline editable) ----------
    Heading: {
      label: 'Heading',
      fields: {
        text: { type: 'text', label: 'Text', contentEditable: true },
        size: { type: 'select', label: 'Size', options: headingSizeOptions },
        ...styleFields,
      },
      defaultProps: { text: 'Heading', size: 'lg' as HeadingSize, color: 'navy' as ColorToken, align: 'left' as Align },
      render: ({ text, size, color, align }) => (
        <div className={cx(container, 'py-6')}>
          <h2 className={cx(headingSizeClass[size as HeadingSize], textColorClass[color as ColorToken], alignClass[align as Align], 'max-w-4xl')}>
            {text}
          </h2>
        </div>
      ),
    },

    // ---------- Text (inline editable) ----------
    Text: {
      label: 'Text',
      fields: {
        text: { type: 'textarea', label: 'Text', contentEditable: true },
        size: { type: 'select', label: 'Size', options: textSizeOptions },
        ...styleFields,
      },
      defaultProps: { text: 'Body copy. Replace this text.', size: 'md' as TextSize, color: 'ink' as ColorToken, align: 'left' as Align },
      render: ({ text, size, color, align }) => (
        <div className={cx(container, 'py-4')}>
          <p className={cx(textSizeClass[size as TextSize], textColorClass[color as ColorToken], alignClass[align as Align], 'max-w-3xl whitespace-pre-line')}>
            {text}
          </p>
        </div>
      ),
    },

    // ---------- Button (inline editable label) ----------
    Button: {
      label: 'Button',
      fields: {
        label: { type: 'text', label: 'Label', contentEditable: true },
        href: linkField('Link'),
        variant: { type: 'select', label: 'Style', options: buttonVariantOptions },
        align: { type: 'select', label: 'Alignment', options: alignOptions },
      },
      defaultProps: { label: 'Get in touch', href: '/contact', variant: 'primary' as ButtonVariant, align: 'left' as Align },
      render: ({ label, href, variant, align }) => (
        <div className={cx(container, 'py-4', align === 'center' && 'text-center')}>
          <ButtonLink label={label} href={href as string} variant={variant as ButtonVariant} />
        </div>
      ),
    },

    // ---------- Feature (eyebrow + heading + body; industrial, no icon circle) ----------
    Feature: {
      label: 'Feature',
      fields: {
        eyebrow: { type: 'text', label: 'Label (small)', contentEditable: true },
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
        align: { type: 'select', label: 'Alignment', options: alignOptions },
      },
      defaultProps: { eyebrow: '01', heading: 'Feature title', body: 'Explain the feature in a sentence or two.', align: 'left' as Align },
      render: ({ eyebrow, heading, body, align }) => (
        <div className={cx(container, 'py-6')}>
          <div className={cx('max-w-xl', alignClass[align as Align])}>
            {eyebrow && <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</div>}
            <h3 className="mt-2 text-xl font-semibold text-navy md:text-2xl">{heading}</h3>
            {body && <p className="mt-2 leading-relaxed text-ink-muted whitespace-pre-line">{body}</p>}
          </div>
        </div>
      ),
    },

    // ---------- Quote / testimonial (inline editable) ----------
    Quote: {
      label: 'Quote',
      fields: {
        quote: { type: 'textarea', label: 'Quote', contentEditable: true },
        author: { type: 'text', label: 'Attribution', contentEditable: true },
        role: { type: 'text', label: 'Role / company', contentEditable: true },
        surface: { type: 'select', label: 'Background', options: surfaceOptions },
      },
      defaultProps: { quote: 'A line worth quoting from a customer or the field.', author: 'Name', role: 'Company', surface: 'paper' as Surface },
      render: ({ quote, author, role, surface }) => {
        const dark = surface === 'navy'
        return (
          <section className={cx(surfaceClass[surface as Surface], 'py-12 md:py-16')}>
            <figure className={cx(container, 'max-w-3xl')}>
              <blockquote className={cx('text-2xl font-semibold leading-snug md:text-3xl', dark ? 'text-white' : 'text-navy')}>“{quote}”</blockquote>
              <figcaption className={cx('mt-4 font-mono text-sm', dark ? 'text-white/70' : 'text-ink-muted')}>
                {author}{role ? <span className={dark ? 'text-white/45' : 'text-ink-faint'}> — {role}</span> : null}
              </figcaption>
            </figure>
          </section>
        )
      },
    },

    // ---------- Accordion / FAQ (array, inline editable) ----------
    Accordion: {
      label: 'FAQ / Accordion',
      fields: {
        items: {
          type: 'array',
          label: 'Items',
          arrayFields: {
            question: { type: 'text', label: 'Question', contentEditable: true },
            answer: { type: 'textarea', label: 'Answer', contentEditable: true },
          },
          defaultItemProps: { question: 'A question?', answer: 'The answer.' },
        },
        spacing: { type: 'select', label: 'Spacing', options: spacingOptions },
      },
      defaultProps: {
        spacing: 'normal' as Spacing,
        items: [
          { question: 'What is your lead time?', answer: 'Dispatch within 2 business days.' },
          { question: 'Do you ship nationwide?', answer: 'Yes, across Malaysia.' },
        ],
      },
      render: ({ items, spacing }) => {
        const rows = (items as { question: React.ReactNode; answer: React.ReactNode }[]) || []
        return (
          <section className={cx(spacingClass[spacing as Spacing])}>
            <div className={cx(container, 'max-w-3xl divide-y divide-rule border-y border-rule')}>
              {rows.map((it, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                    {it.question}
                    <span className="font-mono text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-2 leading-relaxed text-ink-muted whitespace-pre-line">{it.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )
      },
    },

    // ---------- Checklist (array, inline editable) ----------
    Checklist: {
      label: 'Checklist',
      fields: {
        items: {
          type: 'array',
          label: 'Items',
          arrayFields: { text: { type: 'text', label: 'Item', contentEditable: true } },
          defaultItemProps: { text: 'List item' },
        },
        columns: { type: 'select', label: 'Columns', options: [ { label: '1 column', value: '1' }, { label: '2 columns', value: '2' } ] },
      },
      defaultProps: { columns: '1', items: [{ text: 'First point' }, { text: 'Second point' }, { text: 'Third point' }] },
      render: ({ items, columns }) => {
        const rows = (items as { text: React.ReactNode }[]) || []
        return (
          <div className={cx(container, 'py-6')}>
            <ul className={cx('grid gap-3', columns === '2' ? 'sm:grid-cols-2' : 'grid-cols-1', 'max-w-3xl')}>
              {rows.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-ink">
                  <svg className="mt-1 h-4 w-4 shrink-0 text-accent" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="leading-relaxed">{it.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      },
    },

    // ---------- Callout / notice ----------
    Callout: {
      label: 'Callout',
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
        tone: { type: 'select', label: 'Tone', options: [ { label: 'Info', value: 'info' }, { label: 'Success', value: 'success' }, { label: 'Warning', value: 'warn' } ] },
      },
      defaultProps: { heading: 'Good to know', body: 'A short note that needs to stand out.', tone: 'info' },
      render: ({ heading, body, tone }) => {
        const t = tone as 'info' | 'success' | 'warn'
        const bar = t === 'success' ? 'border-l-success' : t === 'warn' ? 'border-l-warn' : 'border-l-accent'
        return (
          <div className={cx(container, 'py-6')}>
            <div className={cx('max-w-3xl rounded-r-md border border-rule border-l-4 bg-paper p-5', bar)}>
              {heading && <div className="font-semibold text-navy">{heading}</div>}
              {body && <p className="mt-1 leading-relaxed text-ink-muted whitespace-pre-line">{body}</p>}
            </div>
          </div>
        )
      },
    },

    // ============ MEDIA ============

    // ---------- Image (adjustable size + alignment) ----------
    Image: {
      label: 'Image',
      fields: {
        image: { type: 'custom', label: 'Image', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> },
        size: { type: 'select', label: 'Size (width)', options: imageSizeOptions },
        align: { type: 'select', label: 'Position', options: imageAlignOptions },
        caption: { type: 'text', label: 'Caption (optional)', contentEditable: true },
      },
      defaultProps: { image: null, caption: '', size: '100', align: 'center' },
      render: ({ image, caption, size, align, width }) => {
        const img = image as MediaValue
        // Back-compat: older blocks stored `width` (full/wide/narrow) not `size`.
        const sz = (size as string) || (width === 'narrow' ? '50' : width === 'wide' ? '75' : '100')
        const al = (align as string) || 'center'
        if (!img?.url) return <div className={cx(container, 'py-6')}><div className="rounded-lg border border-dashed border-rule p-10 text-center text-ink-faint">Pick or upload an image</div></div>
        return (
          <figure className={cx(container, 'py-8')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || ''} className={cx('block w-full rounded-lg object-cover', imageWidthClass[sz] || 'md:w-full', imageAlignClass[al] || 'mx-auto')} />
            {caption && <figcaption className={cx('mt-3 text-sm text-ink-muted', captionAlignClass[al] || 'text-center')}>{caption}</figcaption>}
          </figure>
        )
      },
    },

    // ---------- Gallery (array of images) ----------
    Gallery: {
      label: 'Gallery',
      fields: {
        columns: { type: 'select', label: 'Columns', options: [ { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' } ] },
        items: {
          type: 'array',
          label: 'Images',
          arrayFields: { image: { type: 'custom', label: 'Image', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> } },
          defaultItemProps: { image: null },
        },
      },
      defaultProps: { columns: '3', items: [] },
      render: ({ columns, items }) => {
        const imgs = ((items as { image: MediaValue }[]) || []).filter((x) => x.image?.url)
        const colClass = columns === '4' ? 'sm:grid-cols-2 lg:grid-cols-4' : columns === '2' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
        if (imgs.length === 0) return <div className={cx(container, 'py-6')}><div className="rounded-lg border border-dashed border-rule p-10 text-center text-ink-faint">Add images to the gallery</div></div>
        return (
          <div className={cx(container, 'py-8')}>
            <div className={cx('grid grid-cols-2 gap-4', colClass)}>
              {imgs.map((x, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={x.image!.url} alt={x.image!.alt || ''} className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          </div>
        )
      },
    },

    // ---------- Logo strip ----------
    LogoStrip: {
      label: 'Logo strip',
      fields: {
        heading: { type: 'text', label: 'Heading (optional)', contentEditable: true },
        items: {
          type: 'array',
          label: 'Logos',
          arrayFields: { image: { type: 'custom', label: 'Logo', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> } },
          defaultItemProps: { image: null },
        },
      },
      defaultProps: { heading: 'Trusted by', items: [] },
      render: ({ heading, items }) => {
        const imgs = ((items as { image: MediaValue }[]) || []).filter((x) => x.image?.url)
        return (
          <section className="py-12 md:py-16">
            <div className={container}>
              {heading && <div className="mb-6 text-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">{heading}</div>}
              {imgs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-rule p-8 text-center text-ink-faint">Add logos</div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                  {imgs.map((x, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={x.image!.url} alt={x.image!.alt || ''} className="h-10 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      },
    },

    // ---------- Video embed (adjustable size + alignment) ----------
    Video: {
      label: 'Video',
      fields: {
        url: { type: 'text', label: 'YouTube / Vimeo URL' },
        size: { type: 'select', label: 'Size (width)', options: imageSizeOptions },
        align: { type: 'select', label: 'Position', options: imageAlignOptions },
        caption: { type: 'text', label: 'Caption (optional)', contentEditable: true },
      },
      defaultProps: { url: '', caption: '', size: '100', align: 'center' },
      render: ({ url, caption, size, align }) => {
        const src = embedSrc(url as string)
        const sz = (size as string) || '100'
        const al = (align as string) || 'center'
        return (
          <figure className={cx(container, 'py-8')}>
            {src ? (
              <div className={cx('relative aspect-video w-full overflow-hidden rounded-lg bg-navy', imageWidthClass[sz] || 'md:w-full', imageAlignClass[al] || 'mx-auto')}>
                <iframe src={src} title={(caption as string) || 'Video'} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-rule p-10 text-center text-ink-faint">Paste a YouTube or Vimeo link</div>
            )}
            {caption && <figcaption className={cx('mt-3 text-sm text-ink-muted', captionAlignClass[al] || 'text-center')}>{caption}</figcaption>}
          </figure>
        )
      },
    },

    // ============ MARKETING ============

    // ---------- Hero ----------
    Hero: {
      label: 'Hero',
      fields: {
        heading: { type: 'text', label: 'Headline', contentEditable: true },
        sub: { type: 'textarea', label: 'Supporting line', contentEditable: true },
        ctaLabel: { type: 'text', label: 'Button label', contentEditable: true },
        ctaHref: linkField('Button link'),
        image: { type: 'custom', label: 'Background image', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> },
        surface: { type: 'select', label: 'Background', options: surfaceOptions },
      },
      defaultProps: { heading: 'Headline goes here', sub: 'One supporting sentence.', ctaLabel: 'Get in touch', ctaHref: '/contact', image: null, surface: 'navy' as Surface },
      render: ({ heading, sub, ctaLabel, ctaHref, image, surface }) => {
        const img = image as MediaValue
        const dark = surface === 'navy'
        return (
          <section className={cx('relative overflow-hidden', surfaceClass[surface as Surface] || 'bg-navy text-white')}>
            {img?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.url} alt={img.alt || ''} className="absolute inset-0 h-full w-full object-cover opacity-30" />
            )}
            <div className={cx(container, 'relative py-20 md:py-28')}>
              <h1 className={cx('max-w-3xl font-fraunces text-4xl font-bold leading-[1.05] md:text-6xl', dark ? 'text-white' : 'text-navy')}>
                {heading}
              </h1>
              {sub && <p className={cx('mt-5 max-w-xl text-lg leading-relaxed', dark ? 'text-white/75' : 'text-ink-muted')}>{sub}</p>}
              {ctaLabel && <div className="mt-8"><ButtonLink label={ctaLabel} href={ctaHref as string} variant={dark ? 'navy' : 'primary'} /></div>}
            </div>
          </section>
        )
      },
    },

    // ---------- Image + text split ----------
    ImageText: {
      label: 'Image + text',
      fields: {
        image: { type: 'custom', label: 'Image', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> },
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
        ctaLabel: { type: 'text', label: 'Button label', contentEditable: true },
        ctaHref: linkField('Button link'),
        imageSide: { type: 'select', label: 'Image side', options: [ { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' } ] },
        surface: { type: 'select', label: 'Background', options: surfaceOptions },
      },
      defaultProps: { image: null, heading: 'Section heading', body: 'A paragraph that sits beside the image.', ctaLabel: '', ctaHref: '/contact', imageSide: 'left', surface: 'none' as Surface },
      render: ({ image, heading, body, ctaLabel, ctaHref, imageSide, surface }) => {
        const img = image as MediaValue
        const dark = surface === 'navy'
        const right = imageSide === 'right'
        return (
          <section className={cx(surfaceClass[surface as Surface], 'py-12 md:py-20')}>
            <div className={cx(container, 'grid items-center gap-10 md:grid-cols-2')}>
              <div className={cx(right && 'md:order-2')}>
                {img?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.url} alt={img.alt || ''} className="w-full rounded-lg object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-rule text-ink-faint">Pick or upload an image</div>
                )}
              </div>
              <div className={cx(right && 'md:order-1')}>
                <h2 className={cx('text-2xl font-semibold md:text-3xl', dark ? 'text-white' : 'text-navy')}>{heading}</h2>
                {body && <p className={cx('mt-3 leading-relaxed whitespace-pre-line', dark ? 'text-white/75' : 'text-ink-muted')}>{body}</p>}
                {ctaLabel && <div className="mt-6"><ButtonLink label={ctaLabel} href={ctaHref as string} variant={dark ? 'navy' : 'primary'} /></div>}
              </div>
            </div>
          </section>
        )
      },
    },

    // ---------- Steps / process (array, inline editable) ----------
    Steps: {
      label: 'Steps',
      fields: {
        items: {
          type: 'array',
          label: 'Steps',
          arrayFields: {
            title: { type: 'text', label: 'Title', contentEditable: true },
            body: { type: 'textarea', label: 'Body', contentEditable: true },
          },
          defaultItemProps: { title: 'Step title', body: 'What happens in this step.' },
        },
        spacing: { type: 'select', label: 'Spacing', options: spacingOptions },
      },
      defaultProps: {
        spacing: 'normal' as Spacing,
        items: [
          { title: 'Browse', body: 'Find the right tool in the catalogue.' },
          { title: 'Request', body: 'Submit an order request — no phone call.' },
          { title: 'Dispatch', body: 'We ship within 2 business days.' },
        ],
      },
      render: ({ items, spacing }) => {
        const rows = (items as { title: React.ReactNode; body: React.ReactNode }[]) || []
        return (
          <section className={cx(spacingClass[spacing as Spacing])}>
            <div className={cx(container, 'grid gap-8 md:grid-cols-3')}>
              {rows.map((it, i) => (
                <div key={i} className="border-t-2 border-navy pt-4">
                  <div className="font-mono text-3xl font-bold text-navy">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mt-2 text-lg font-semibold text-navy">{it.title}</h3>
                  {it.body && <p className="mt-1 leading-relaxed text-ink-muted whitespace-pre-line">{it.body}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      },
    },

    // ---------- Stats (array, inline editable) ----------
    Stats: {
      label: 'Stats',
      fields: {
        items: {
          type: 'array',
          label: 'Stats',
          arrayFields: {
            value: { type: 'text', label: 'Number', contentEditable: true },
            label: { type: 'text', label: 'Label', contentEditable: true },
          },
          defaultItemProps: { value: '100+', label: 'Describe this stat' },
        },
        spacing: { type: 'select', label: 'Spacing', options: spacingOptions },
      },
      defaultProps: {
        spacing: 'normal' as Spacing,
        items: [
          { value: 'Since 2007', label: 'Serving Malaysian contractors' },
          { value: '500+', label: 'Products in the catalogue' },
          { value: '247', label: 'Active contractor accounts' },
          { value: '2 days', label: 'Typical dispatch time' },
        ],
      },
      render: ({ items, spacing }) => {
        const stats = (items as { value: React.ReactNode; label: React.ReactNode }[]) || []
        if (stats.length === 0) return <></>
        return (
          <section className={cx(spacingClass[spacing as Spacing])}>
            <div className={cx(container, 'grid grid-cols-2 gap-8 md:grid-cols-4')}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-mono text-3xl font-bold text-navy md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm text-ink-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        )
      },
    },

    // ---------- CTA banner ----------
    CTABanner: {
      label: 'CTA banner',
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        ctaLabel: { type: 'text', label: 'Button label', contentEditable: true },
        ctaHref: linkField('Button link'),
      },
      defaultProps: { heading: 'Ready to start?', ctaLabel: 'Contact us', ctaHref: '/contact' },
      render: ({ heading, ctaLabel, ctaHref }) => (
        <section className="bg-navy text-white">
          <div className={cx(container, 'flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center')}>
            <h2 className="max-w-2xl text-2xl font-semibold md:text-3xl">{heading}</h2>
            <ButtonLink label={ctaLabel} href={ctaHref as string} variant="navy" />
          </div>
        </section>
      ),
    },

    // ============ LAYOUT ============

    // ---------- Section (surface + spacing + slot) ----------
    Section: {
      label: 'Section',
      fields: {
        surface: { type: 'select', label: 'Background', options: surfaceOptions },
        spacing: { type: 'select', label: 'Spacing', options: spacingOptions },
        content: { type: 'slot' },
      },
      defaultProps: { surface: 'none' as Surface, spacing: 'normal' as Spacing },
      render: ({ surface, spacing, content: Content }) => (
        <section className={cx(surfaceClass[surface as Surface], spacingClass[spacing as Spacing])}>
          <Content />
        </section>
      ),
    },

    // ---------- Columns (2-3 drop-zone slots, adjustable width ratio) ----------
    Columns: {
      label: 'Columns',
      fields: {
        layout: { type: 'select', label: 'Layout (width split)', options: columnLayoutOptions },
        spacing: { type: 'select', label: 'Spacing', options: spacingOptions },
        col1: { type: 'slot' },
        col2: { type: 'slot' },
        col3: { type: 'slot' },
      },
      defaultProps: { layout: '6-6', spacing: 'normal' as Spacing },
      render: ({ layout, count, spacing, col1: Col1, col2: Col2, col3: Col3 }) => {
        // Back-compat: older blocks stored `count` ('2'/'3') instead of `layout`.
        const value = (layout as string) || (count === '3' ? '4-4-4' : '6-6')
        const parts = value.split('-')
        const slots = [Col1, Col2, Col3]
        return (
          <div className={cx(spacingClass[spacing as Spacing])}>
            <div className={cx(container, 'grid grid-cols-1 gap-8 md:grid-cols-12')}>
              {parts.map((p, i) => {
                const Slot = slots[i]
                return (
                  <div key={i} className={colSpanClass[p] || 'md:col-span-6'}>
                    <Slot />
                  </div>
                )
              })}
            </div>
          </div>
        )
      },
    },

    // ---------- Card (drop into Columns/Section) ----------
    Card: {
      label: 'Card',
      fields: {
        image: { type: 'custom', label: 'Image (optional)', render: ({ onChange, value }) => <MediaField value={value as MediaValue} onChange={onChange} /> },
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
        ctaLabel: { type: 'text', label: 'Link label (optional)', contentEditable: true },
        ctaHref: linkField('Link'),
      },
      defaultProps: { image: null, heading: 'Card title', body: 'A short description for this card.', ctaLabel: '', ctaHref: '' },
      render: ({ image, heading, body, ctaLabel, ctaHref }) => {
        const img = image as MediaValue
        return (
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-white">
            {img?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.url} alt={img.alt || ''} className="aspect-[16/10] w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-navy">{heading}</h3>
              {body && <p className="mt-2 flex-1 leading-relaxed text-ink-muted whitespace-pre-line">{body}</p>}
              {ctaLabel && (
                <a href={(ctaHref as string) || '#'} className="mt-4 inline-flex items-center font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent hover:opacity-80">
                  {ctaLabel} →
                </a>
              )}
            </div>
          </div>
        )
      },
    },

    // ---------- Spacer ----------
    Spacer: {
      label: 'Spacer',
      fields: { size: { type: 'select', label: 'Height', options: spacingOptions } },
      defaultProps: { size: 'normal' as Spacing },
      render: ({ size }) => <div className={spacingClass[size as Spacing]} aria-hidden="true" />,
    },

    // ---------- Divider ----------
    Divider: {
      label: 'Divider',
      fields: {},
      defaultProps: {},
      render: () => <div className={container}><hr className="border-rule" /></div>,
    },

    // ============ HOME (locked layout, editable content) ============
    // Bespoke blocks that render the exact live-home markup. Used on the home
    // page in a locked arrangement (no drag/insert) — see puck/blocks/home.tsx.
    ...homeBlocks,

    // ============ EDITORIAL PAGES (locked, one block per page) ============
    ...pageBlocks,
  },

  // Category grouping for the editor's component list.
  categories: {
    layout: { title: 'Layout', components: ['Section', 'Columns', 'Card', 'Spacer', 'Divider'] },
    content: { title: 'Content', components: ['Heading', 'Text', 'Button', 'Feature', 'Quote', 'Accordion', 'Checklist', 'Callout'] },
    media: { title: 'Media', components: ['Image', 'Gallery', 'LogoStrip', 'Video'] },
    marketing: { title: 'Marketing', components: ['Hero', 'ImageText', 'Steps', 'Stats', 'CTABanner'] },
    home: { title: 'Home sections (locked)', components: homeBlockNames as string[] },
    pages: { title: 'Pages (locked)', components: pageBlockNames as string[] },
  },
}

export default config
