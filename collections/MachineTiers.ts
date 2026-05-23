import type { CollectionConfig } from 'payload'
import {
  readOptionList,
  createOptionList,
  updateOptionList,
  deleteOptionList,
} from '@/lib/access/optionLists'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

export const MachineTiers: CollectionConfig = {
  slug: 'machineTiers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameBM', 'powerRange'],
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
      admin: { description: 'English name e.g. Low Power' },
    },
    {
      name: 'nameBM',
      type: 'text',
      required: true,
      admin: { description: 'Bahasa Melayu name e.g. Kuasa Rendah' },
    },
    {
      name: 'powerRange',
      type: 'text',
      admin: { description: 'e.g. < 2kW' },
    },
  ]),
}
