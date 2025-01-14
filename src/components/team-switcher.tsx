'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { usePages } from './Pages/Provider'
import Link from 'next/link'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()

  const { pages, activePage, setActivePage } = usePages()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/*              <activeTeam.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">@{activePage?.pageName}</span>
                <span className="truncate text-xs">{activePage?.description}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Pages</DropdownMenuLabel>
            {pages.map((page, index) => (
              <DropdownMenuItem
                onClick={() => {
                  setActivePage(page)
                }}
                className="gap-2 p-2 cursor-pointer"
                asChild
                key={page.pageName}
              >
                <Link href={'/dashboard/@' + page.pageName}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* <team.logo className="size-4 shrink-0" /> */}
                  </div>
                  @{page.pageName}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>{' '}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2 cursor-pointer" asChild>
              <Link href={'/dashboard/pages/create'}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Create page</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
