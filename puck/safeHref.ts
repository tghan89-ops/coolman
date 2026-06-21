/**
 * Allowlist a link href before it reaches a public `<a href>`. Blocks
 * `javascript:`, `data:`, `vbscript:` and any other unknown scheme — including
 * whitespace/control-char obfuscation (e.g. a tab inside "javascript:") that
 * browsers strip back into an executable scheme. Relative paths, fragments and
 * the safe schemes (http/https/mailto/tel) pass through unchanged.
 *
 * This is the load-bearing guard: it runs at RENDER time so it also covers
 * hand-edited puckData, not just values typed through the LinkField.
 */
const SAFE_SCHEMES = ['http', 'https', 'mailto', 'tel']

export function safeHref(href: string | null | undefined): string {
  const v = (href ?? '').trim()
  if (!v) return '#'
  // Strip all whitespace (space/tab/newline/CR/FF/VT) and lowercase for the
  // scheme probe only — browsers ignore those inside a scheme, so an attacker
  // can split "javascript:" with a tab. The returned value is the original
  // (untouched) href when it passes.
  const probe = v.replace(/\s+/g, '').toLowerCase()
  const m = probe.match(/^([a-z][a-z0-9+.-]*):/)
  if (m && !SAFE_SCHEMES.includes(m[1])) return '#'
  return v
}
