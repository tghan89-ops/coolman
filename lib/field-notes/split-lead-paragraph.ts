// Splits a sanitised HTML body into "first paragraph" (the lede) and "rest"
// so a drop-cap can be applied to the first paragraph via a scoped CSS class
// without parsing or re-serialising the body in JS.
//
// Behaviour:
//   - If the body is empty, returns { lead: '', rest: '' }.
//   - If the body does NOT start with <p, the entire body goes into `rest`
//     and `lead` is empty (drop-cap simply does not render — safe default).
//   - If the body starts with <p but the closing </p> is missing, the whole
//     body goes into `rest` (defensive — we never split mid-tag).
//   - Otherwise the slice runs from index 0 through the first </p>, inclusive.
//
// The split is a simple string slice — fast, no DOM, no parsing.

export function splitLeadParagraph(html: string): { lead: string; rest: string } {
  if (!html) return { lead: '', rest: '' }
  const trimmed = html.trimStart()
  if (!trimmed.toLowerCase().startsWith('<p')) {
    return { lead: '', rest: html }
  }
  const closeIdx = trimmed.toLowerCase().indexOf('</p>')
  if (closeIdx === -1) return { lead: '', rest: html }
  const lead = trimmed.slice(0, closeIdx + 4)
  const rest = trimmed.slice(closeIdx + 4)
  return { lead, rest }
}
