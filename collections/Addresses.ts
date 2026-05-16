import type { CollectionConfig } from 'payload'

const MAX_ADDRESSES_PER_CONTRACTOR = 5

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'contractor', 'isDefault', 'updatedAt'],
    description: 'Delivery addresses, up to 5 per contractor. One must be the default.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return (user as any).collection === 'contractors'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Contractor self-creating: stamp contractor from session.
        const user: any = req.user
        if (operation === 'create' && user?.collection === 'contractors') {
          data.contractor = user.id
        }

        // Enforce per-contractor cap on create.
        if (operation === 'create') {
          const contractorId = data.contractor ?? (user?.collection === 'contractors' ? user.id : null)
          if (contractorId) {
            const existing = await req.payload.count({
              collection: 'addresses',
              where: { contractor: { equals: contractorId } },
            })
            if (existing.totalDocs >= MAX_ADDRESSES_PER_CONTRACTOR) {
              throw new Error(`address_cap_reached:${MAX_ADDRESSES_PER_CONTRACTOR}`)
            }
            // First address of a contractor auto-defaults.
            if (existing.totalDocs === 0) data.isDefault = true
          }
        }

        // If marking this row as default, clear default on siblings.
        if (data.isDefault === true) {
          const contractorId = data.contractor ?? originalDoc?.contractor
          if (contractorId) {
            const siblings = await req.payload.find({
              collection: 'addresses',
              where: {
                contractor: { equals: contractorId },
                isDefault: { equals: true },
                ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
              },
              limit: 100,
              overrideAccess: true,
            })
            for (const sib of siblings.docs) {
              await req.payload.update({
                collection: 'addresses',
                id: (sib as any).id,
                data: { isDefault: false },
                overrideAccess: true,
              })
            }
          }
        }

        return data
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // If we deleted the default, promote the most-recently-updated sibling.
        if (!(doc as any)?.isDefault) return
        const contractorId = (doc as any)?.contractor
        if (!contractorId) return
        const remaining = await req.payload.find({
          collection: 'addresses',
          where: { contractor: { equals: contractorId } },
          sort: '-updatedAt',
          limit: 1,
          overrideAccess: true,
        })
        const next = remaining.docs[0] as any
        if (next) {
          await req.payload.update({
            collection: 'addresses',
            id: next.id,
            data: { isDefault: true },
            overrideAccess: true,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'contractor',
      type: 'relationship',
      relationTo: 'contractors',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      maxLength: 40,
      admin: { description: 'Short name shown in the address picker (e.g. "Site A", "HQ").' },
    },
    {
      name: 'addressText',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: { description: 'Full delivery address. Max 500 characters.' },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { description: 'Preselected on the cart page. Only one default per contractor.' },
    },
  ],
}

export const ADDRESS_CAP = MAX_ADDRESSES_PER_CONTRACTOR
