import { CollectionConfig, Validate } from 'payload'

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
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      timezone: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      timezone: true,
    },
    {
      name: 'eventType',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Local Event',
          value: 'localEvent',
        },
        {
          label: 'Online Event',
          value: 'onlineEvent',
        },
      ],
    },
    { name: 'coordinates', type: 'point' },
    {
      name: 'long',
      type: 'number',
      // validate: ((value, ctx) =>
      //   String(
      //     !ctx.siblingData.eventType?.includes('localEvent') || 'You must select a location.',
      //   )) satisfies Validate,
    },
    {
      name: 'lat',
      type: 'number',
      // validate: ((value, ctx) =>
      //   String(
      //     !ctx.siblingData.eventType?.includes('localEvent') || 'You must select a location.',
      //   )) satisfies Validate,
    },

    {
      name: 'deleted',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'addressName',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'state',
      type: 'text',
    },
    {
      name: 'zipCode',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
  ],
}
