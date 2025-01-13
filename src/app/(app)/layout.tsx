import { UserProvider } from '@/components/Auth/Provider'
import './style.css'
import { getUser } from '@/components/Auth/actions/auth'

export const metadata = {
  title: 'be-vegan.org',
  description: '',
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return (
    <html lang="en">
      <body>
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  )
}
