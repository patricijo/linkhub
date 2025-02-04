import { admin } from '@/access/admin'
import { authenticated } from '@/access/authenticated'
import { ownerAccess } from '@/access/owner'
import { owner } from '@/collections/fields/owner'
import type { CollectionConfig } from 'payload'

export const PageLinks: CollectionConfig = {
  slug: 'pageLinks',
  access: {
    admin: admin,
    create: authenticated,
    update: ownerAccess,
    delete: ownerAccess,
    read: ownerAccess,
  },
  labels: {
    singular: 'Link',
    plural: 'Links',
  },
  custom: {
    description: 'Add your link to your page.',
  },
  admin: {},
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value }) => {
            return value.includes('://') ? value : `https://${value}`
          },
        ],
      },
    },
    {
      name: 'label',
      type: 'text',
    },

    owner,
    { name: 'description', type: 'text' },
    { name: 'renderStyle', type: 'text' },
  ],
}
