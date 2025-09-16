export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex absolute top-0 w-full min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full mt-16 max-w-sm md:max-w-3xl items-center">{children}</div>
    </div>
  )
}
