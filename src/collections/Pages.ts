import { PageLinks } from '@/components/Pages/components/PageLinks/Collection'
import { PageYoutubeVideos } from '@/components/Pages/components/PageYoutubeVideos/Collection'

import { CollectionConfig } from 'payload'
import { owner } from './fields/owner'
import { authenticated } from '@/access/authenticated'
import { ownerAccess } from '@/access/owner'
import { admin } from '@/access/admin'

export const PagesCollection: CollectionConfig = {
  slug: 'pages',
  access: {
    admin: admin,
    create: authenticated,
    update: ownerAccess,
    delete: ownerAccess,
    read: ownerAccess,
  },

  admin: {
    useAsTitle: 'pageName',
  },
  fields: [
    {
      name: 'pageName',
      type: 'text',
      unique: true,
      required: true,
    },
    owner,
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'socials',
      type: 'array',

      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
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
      ],
    },
    {
      name: 'content',
      type: 'relationship',
      hasMany: true,
      relationTo: ['pageLinks', 'pageYoutubeVideos'],
    },
    {
      name: 'profilePicture',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'deleted',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export const ComponentCollections = [PageLinks, PageYoutubeVideos]

export const PagesCollections = [PagesCollection, ...ComponentCollections]
