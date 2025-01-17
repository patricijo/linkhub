import type { Access } from 'payload'

export const ownerAccess: Access = ({ req: { user }, data }) => {
  if (user?.email === 'sebastian.patrici@gmail.com') return true
  if (user) {
    return {
      owner: {
        equals: user,
      },
    }
  }
  return false
}
