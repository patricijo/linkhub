import type { CollectionConfig } from 'payload'

import { admin } from '@/access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: admin,
    update: admin,
    delete: admin,
    read: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
