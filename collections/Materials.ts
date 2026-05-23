import type { CollectionConfig } from 'payload'
import {
  readOptionList,
  createOptionList,
  updateOptionList,
  deleteOptionList,
} from '@/lib/access/optionLists'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

export const Materials: CollectionConfig = {
  slug: 'materials',
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
      admin: { description: 'English name e.g. Granite' },
    },
    {
      name: 'nameBM',
      type: 'text',
      required: true,
      admin: { description: 'Bahasa Melayu name e.g. Granit' },
    },
  ]),
}
