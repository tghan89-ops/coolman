import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'category', 'listPrice'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${data.id}`,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Unique product code e.g. CM-GRN-230' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Diamond Blades', value: 'Diamond Blades' },
        { label: 'Diamond Core Bits', value: 'Diamond Core Bits' },
        { label: 'Diamond Cartwheel', value: 'Diamond Cartwheel' },
        { label: 'Diamond Polishing Pad', value: 'Diamond Polishing Pad' },
      ],
    },
    {
      name: 'diameter',
      type: 'text',
      required: true,
      admin: { description: 'e.g. 230mm' },
    },
    {
      name: 'arborSize',
      type: 'text',
      required: true,
      admin: { description: 'e.g. 22.23mm or M14' },
    },
    {
      name: 'segmentHeight',
      type: 'text',
      required: true,
      admin: { description: 'e.g. 10mm' },
    },
    {
      name: 'bondType',
      type: 'select',
      required: true,
      options: [
        { label: 'Soft', value: 'Soft' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Hard', value: 'Hard' },
        { label: 'Extra Hard', value: 'Extra Hard' },
      ],
    },
    {
      name: 'recommendedMaterials',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Granite', value: 'Granite' },
        { label: 'Concrete', value: 'Concrete' },
        { label: 'Tile', value: 'Tile' },
        { label: 'Brick', value: 'Brick' },
        { label: 'Marble', value: 'Marble' },
        { label: 'Homogeneous Tile', value: 'Homogeneous Tile' },
        { label: 'Sandstone', value: 'Sandstone' },
        { label: 'Asphalt', value: 'Asphalt' },
      ],
    },
    {
      name: 'applications',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Floor Cutting', value: 'Floor Cutting' },
        { label: 'Wall Cutting', value: 'Wall Cutting' },
        { label: 'Coring', value: 'Coring' },
        { label: 'Grinding', value: 'Grinding' },
      ],
    },
    {
      name: 'recommendedMachinePower',
      type: 'select',
      required: true,
      options: [
        { label: 'Low (< 2kW)', value: 'low' },
        { label: 'Medium (2-4kW)', value: 'medium' },
        { label: 'High (> 4kW)', value: 'high' },
      ],
    },
    {
      name: 'recommendedCuttingVolume',
      type: 'text',
      admin: { description: 'e.g. 500+ sqm' },
    },
    {
      name: 'listPrice',
      type: 'number',
      required: true,
      admin: { description: 'Base list price in MYR before any discounts' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'Full YouTube URL e.g. https://youtube.com/watch?v=...' },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
