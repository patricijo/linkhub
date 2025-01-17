import { UserProvider } from '@/components/Auth/Provider'
import './style.css'
import { getUser } from '@/components/Auth/actions/auth'

export const metadata = {
  title: 'LinkHub',
  description: 'One Page. All Your Links.',
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return (
    <html lang="en">
      <body className="bg-muted ">
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  )
}
