import './style.css'

export const metadata = {
  title: 'be-vegan.org',
  description: '',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
