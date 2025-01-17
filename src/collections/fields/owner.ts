import type { Field } from 'payload'

export const owner: Field = {
  name: 'owner',
  type: 'relationship',
  relationTo: 'users',
  required: true,
  admin: {
    hidden: true, // This hides the field from the admin panel form
  },
  hooks: {
    beforeChange: [
      async ({ req, operation }) => {
        // Target the 'owner' field during the create operation
        if (operation === 'create' && req.user) {
          return req.user.id // Automatically set the owner to the current user's ID
        }
      },
    ],
  },
}
