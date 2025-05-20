import { getUser } from '@/components/Auth/actions/auth'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (user) {
    redirect('/dashboard')
    return null
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navbar /> <div className="w-full max-w-sm md:max-w-sm">{children} </div>
    </div>
  )
}
