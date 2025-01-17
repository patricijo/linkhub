import { admin } from '@/access/admin'
import { authenticated } from '@/access/authenticated'
import { ownerAccess } from '@/access/owner'

import { owner } from '@/collections/fields/owner'
import type { CollectionConfig } from 'payload'

export const PageYoutubeVideos: CollectionConfig = {
  slug: 'pageYoutubeVideos',
  access: {
    admin: admin,
    create: authenticated,
    update: ownerAccess,
    delete: ownerAccess,
    read: ownerAccess,
  },
  labels: {
    singular: 'Youtube Video',
    plural: 'Youtube Videos',
  },
  custom: {
    description: 'Add a Youtube video to your page.',
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
    owner,
  ],
}
