'use client'

import {
  ChevronRight,
  Edit,
  Frame,
  Instagram,
  Layers,
  Link,
  Monitor,
  MoreHorizontal,
  Plus,
  type LucideIcon,
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { usePages } from './Pages/Provider'

export function NavPage() {
  const { activePage } = usePages()

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <Collapsible asChild defaultOpen={true} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={'Header Links'}>
                  {<Monitor />}
                  <span>Page</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href={'/@' + activePage?.pageName}>
                        <span>View</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href={'/dashboard/page/@' + activePage?.pageName + '/edit'}>
                        <span>Edit</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible asChild defaultOpen={false} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={'Header Links'}>
                  {<Link />}
                  <span>Header Links</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {activePage?.socials?.map((item) => (
                    <div key={item.id + 'nav'}>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </div>
                  ))}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      {/* <a href={'/dashboard/@' + activePage?.pageName + '/links/create'}>
                        <Plus />
                        <span>Add a link</span>
                      </a> */}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
