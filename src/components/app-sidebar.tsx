'use client'

import * as React from 'react'

import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavPage } from './nav-page'
import { usePages } from './Pages/Provider'
import { PageForm } from './Pages/PageForm'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Card } from './ui/card'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pages } = usePages()

  return (
    <Sidebar collapsible="icon" {...props}>
      {pages[0] ? (
        <>
          <SidebarHeader>
            <TeamSwitcher />
          </SidebarHeader>
          <SidebarContent>
            <NavPage />
          </SidebarContent>
        </>
      ) : (
        <SidebarContent className="content-center items-center place-items-center justify-center">
          <div className="place-self-center cent text-lg text-muted-foreground">
            Please create a page
          </div>
        </SidebarContent>
      )}

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
