import { PageLinks } from '@/components/Pages/components/PageLinks/Collection'
import { CollectionConfig } from 'payload'

export const PagesCollection: CollectionConfig = {
  slug: 'pages',
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
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
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
      relationTo: ['pageLinks'],
    },
    {
      name: 'profilePicture',
      type: 'relationship',
      relationTo: 'media',
    },
  ],
}

export const ComponentCollections = [PageLinks]

export const PagesCollections = [PagesCollection, ...ComponentCollections]
