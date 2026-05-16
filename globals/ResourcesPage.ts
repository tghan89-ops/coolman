import type { GlobalConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }

export const ResourcesPage: GlobalConfig = {
  slug: 'resources-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/resources`,
    },
  },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Resources' },
    { name: 'heroTitleBM', type: 'text', admin: bmDesc },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Technical guides, datasheets, and videos to help you get the most from Coolman tools.' },
    { name: 'heroSubtitleBM', type: 'textarea', admin: bmDesc },
    {
      name: 'downloads',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'description', type: 'text' },
        { name: 'descriptionBM', type: 'text', admin: bmDesc },
        { name: 'file', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'youtubeUrl', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'descriptionBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      admin: { description: 'Frequently asked questions shown below the resources grid.' },
      defaultValue: [
        { question: 'How do I select the right blade for my application?', answer: 'Consider the material you are cutting, the hardness, whether it is reinforced, and the type of cut (wet or dry). Our Blade Selection Guide provides detailed recommendations, or contact our technical team for personalized advice.' },
        { question: 'What is the difference between segmented and continuous rim blades?', answer: 'Segmented blades have gaps between segments for aggressive cutting and cooling, ideal for concrete and masonry. Continuous rim blades provide smoother cuts with less chipping, perfect for tile and stone.' },
        { question: 'How do I maximize blade life?', answer: 'Use the correct blade for your material, maintain proper RPM and feed rates, ensure adequate water flow for wet cutting, and allow the blade to cut rather than forcing it.' },
        { question: 'Do you offer bulk pricing for contractors?', answer: 'Yes, registered contractors receive tiered pricing based on volume. Create a contractor account to view your pricing tier and available discounts.' },
      ],
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'questionBM', type: 'text', admin: bmDesc },
        { name: 'answer', type: 'textarea', required: true },
        { name: 'answerBM', type: 'textarea', admin: bmDesc },
      ],
    },
  ],
}
