import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAdmin = (args: AccessArgs<User>) => boolean

export const admin: isAdmin = ({ req: { user } }) => {
  if (user?.email === 'sebastian.patrici@gmail.com') return true
  return false
}
