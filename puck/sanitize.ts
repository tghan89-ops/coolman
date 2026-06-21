import puckConfig from '@/puck/config'

/**
 * Drop any block whose type isn't a registered component (malformed-block
 * safety). Puck 0.21's slot model nests child blocks INLINE in a parent's props
 * (e.g. Section.props.content[], Columns.props.col1[]), not in `zones`, so we
 * recurse through every array-valued prop and filter nested blocks too —
 * otherwise one bad block inside a layout slot reaches <Render> and crashes the
 * page. Shared by the catch-all route and the home route.
 */
export type Block = { type: string; props?: Record<string, unknown> }
export type PuckData = { root?: unknown; content?: Block[]; zones?: unknown }

const isBlock = (x: unknown): x is Block =>
  !!x && typeof x === 'object' && typeof (x as { type?: unknown }).type === 'string'

function cleanProps(props: Record<string, unknown>, known: Set<string>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, val] of Object.entries(props)) {
    if (Array.isArray(val)) {
      out[k] = val
        .map((item) => (isBlock(item) ? cleanBlock(item, known) : item))
        .filter((item) => item !== null)
    } else {
      out[k] = val
    }
  }
  return out
}

function cleanBlock(block: Block, known: Set<string>): Block | null {
  if (!isBlock(block) || !known.has(block.type)) return null
  return block.props ? { ...block, props: cleanProps(block.props, known) } : block
}

export function sanitizePuckData(data: PuckData): PuckData {
  const known = new Set(Object.keys(puckConfig.components))
  const content = Array.isArray(data?.content)
    ? (data.content.map((b) => cleanBlock(b, known)).filter(Boolean) as Block[])
    : []
  return { root: data?.root ?? {}, content, zones: (data?.zones as object) ?? {} }
}
