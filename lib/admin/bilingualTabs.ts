import type { Field } from 'payload'

const REF_COMPONENT = '@/components/admin/EnglishReference#EnglishReference'
const BM_DESC_TEXT = 'Bahasa Malaysia. Leave blank to fall back to English.'

/** Adds the EN-reference beforeInput component to a BM field and strips the old description hint. */
function withRef(field: Field): Field {
  const f = field as any
  return {
    ...f,
    admin: {
      ...f.admin,
      ...(f.admin?.description === BM_DESC_TEXT ? { description: undefined } : {}),
      components: {
        ...f.admin?.components,
        beforeInput: [...(f.admin?.components?.beforeInput ?? []), REF_COMPONENT],
      },
    },
  }
}

const isBM = (f: Field): boolean =>
  'name' in f && typeof (f as any).name === 'string' && (f as any).name.endsWith('BM')

const hasBMPair = (f: Field, all: Field[]): boolean =>
  'name' in f &&
  typeof (f as any).name === 'string' &&
  all.some(g => 'name' in g && (g as any).name === `${(f as any).name}BM`)

const isTranslated = (f: Field, all: Field[]): boolean =>
  isBM(f) || hasBMPair(f, all)

/**
 * Splits a flat list of EN/BM field pairs into a two-tab layout.
 *
 * - Non-translated fields that appear before the first EN/BM pair stay before the tabs.
 * - EN fields go into the "English" tab.
 * - BM fields go into the "Bahasa Malaysia" tab, each with the EN reference hint.
 * - Non-translated fields that appear after the last EN/BM pair stay after the tabs.
 *
 * Call this on any group's or array's `fields` array.
 */
export function bilingualTabs(fields: Field[]): Field[] {
  const firstTranslated = fields.findIndex(f => isTranslated(f, fields))
  const lastTranslated = fields.map((f, i) => (isTranslated(f, fields) ? i : -1)).filter(i => i >= 0).at(-1) ?? -1

  if (firstTranslated === -1) return fields

  const before: Field[] = []
  const enFields: Field[] = []
  const bmFields: Field[] = []
  const after: Field[] = []

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if (isBM(f)) {
      bmFields.push(withRef(f))
    } else if (hasBMPair(f, fields)) {
      enFields.push(f)
    } else if (i < firstTranslated) {
      before.push(f)
    } else {
      after.push(f)
    }
  }

  if (enFields.length === 0 && bmFields.length === 0) return fields

  const tabsField: Field = {
    type: 'tabs',
    tabs: [
      { label: 'English', fields: enFields },
      {
        label: 'Bahasa Malaysia',
        description: 'Leave blank on any field to fall back to English.',
        fields: bmFields,
      },
    ],
  }

  return [...before, tabsField, ...after]
}
