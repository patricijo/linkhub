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
import Image from 'next/image'

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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                {typeof activePage?.profilePicture !== 'string' &&
                  activePage?.profilePicture &&
                  activePage?.profilePicture.sizes?.thumbnail?.url && (
                    <Image
                      src={activePage?.profilePicture.sizes?.thumbnail?.url}
                      alt="Profile Picture"
                      width={30}
                      height={30}
                    />
                  )}
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
                <Link href={'/dashboard/page/@' + page.pageName}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {typeof page.profilePicture !== 'string' &&
                      page.profilePicture &&
                      page.profilePicture.sizes?.thumbnail?.url && (
                        <Image
                          src={page.profilePicture.sizes?.thumbnail?.url}
                          alt="Profile Picture"
                          width={20}
                          height={20}
                        />
                      )}
                  </div>
                  @{page.pageName}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>{' '}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2 cursor-pointer" asChild>
              <Link href={'/dashboard/page/create'}>
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
