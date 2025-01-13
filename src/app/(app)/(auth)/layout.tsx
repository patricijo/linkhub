import { getUser } from '@/components/Auth/actions/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (user) {
    redirect('/dashboard')
    return null
  }

  return <div className="w-full max-w-sm md:max-w-3xl">{children} </div>
}
