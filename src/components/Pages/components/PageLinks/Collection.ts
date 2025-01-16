import type { CollectionConfig } from 'payload'

export const PageLinks: CollectionConfig = {
  slug: 'pageLinks',
  labels: {
    singular: 'Link',
    plural: 'Links',
  },
  custom: {
    description: 'Add your link to your page. Try a youtube link',
  },
  admin: {},
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
    },

    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    { name: 'description', type: 'text' },
    { name: 'renderStyle', type: 'text' },
  ],
}
