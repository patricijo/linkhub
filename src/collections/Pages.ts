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
          name: 'typeOfSocial',
          type: 'select',
          options: [
            'twitter',
            'facebook',
            'instagram',
            'linkedin',
            'youtube',
            'tiktok',
            'pinterest',
            'snapchat',
            'twitch',
            'discord',
            'whatsapp',
            'telegram',
            'reddit',
            'medium',
            'github',
          ],
        },
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'content',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
