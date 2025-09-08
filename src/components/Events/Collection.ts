import { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { ownerAccess } from '@/access/owner'
import { admin } from '@/access/admin'
import { owner } from '@/collections/fields/owner'

export const EventsCollection: CollectionConfig = {
  slug: 'events',
  access: {
    admin: admin,
    create: authenticated,
    update: ownerAccess,
    delete: ownerAccess,
    read: ownerAccess,
  },

  admin: {
    useAsTitle: 'eventName',
  },
  fields: [
    {
      name: 'eventName',
      type: 'text',
      required: true,
    },
    owner,
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      timezone: true,
    },
    {
      name: 'endDate',
      type: 'date',
      timezone: true,
    },
    {
      name: 'onlineEvent',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'localEvent',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'deleted',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
