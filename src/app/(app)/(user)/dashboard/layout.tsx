import { AppSidebar } from '@/components/app-sidebar'
import { getUser } from '@/components/Auth/actions/auth'
import { getPages } from '@/components/Pages/actions/pages'
import { PagesProvider } from '@/components/Pages/Provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | LinkHub',
  description: 'One Page. All Your Links.',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    redirect('/signin')
    return null
  }

  const pages = await getPages()

  return (
    <PagesProvider pages={pages}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex z-30 bg-white h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Pages</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex absolute top-0 w-full min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full mt-16 max-w-sm md:max-w-3xl items-center">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PagesProvider>
  )
}
