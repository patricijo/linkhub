import { UserProvider } from '@/components/Auth/Provider'
import './style.css'
import { getUser } from '@/components/Auth/actions/auth'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast'

export const metadata = {
  title: 'LinkHub',
  description: 'One Page. All Your Links.',
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return (
    <html lang="en">
      <body className="bg-muted w-full h-screen relative">
        <ToastProvider>
          <UserProvider user={user}>{children}</UserProvider>
        </ToastProvider>
        <Toaster />
      </body>
    </html>
  )
}
