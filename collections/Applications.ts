import type { CollectionConfig } from 'payload'
import {
  readOptionList,
  createOptionList,
  updateOptionList,
  deleteOptionList,
} from '@/lib/access/optionLists'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameBM'],
  },
  access: {
    read: readOptionList,
    create: createOptionList,
    update: updateOptionList,
    delete: deleteOptionList,
  },
  fields: bilingualTabs([
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'English name e.g. Floor Cutting' },
    },
    {
      name: 'nameBM',
      type: 'text',
      required: true,
      admin: { description: 'Bahasa Melayu name e.g. Pemotongan Lantai' },
    },
  ]),
}
