import type { CollectionConfig } from 'payload'

export const CronRuns: CollectionConfig = {
  slug: 'cronRuns',
  admin: {
    useAsTitle: 'job_name',
    defaultColumns: ['job_name', 'status', 'started_at', 'completed_at', 'rows_processed'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: () => true,
    delete: () => false,
  },
  fields: [
    {
      name: 'job_name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. unresponded-order-alert or weekly-trends' },
    },
    {
      name: 'started_at',
      type: 'date',
      required: true,
    },
    {
      name: 'completed_at',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Running', value: 'running' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'running',
    },
    {
      name: 'rows_processed',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
