import type { Metadata } from 'next'
import { getUser } from '@/components/Auth/actions/auth'
import { getPage } from '@/components/Pages/actions/pages'
import { RenderPage } from '@/components/Pages/RenderPage'
import { cache } from 'react'

import { ArrowDown, ChevronsUpDown, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from '@/components/Auth/LogoutButton'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { getEvent } from '@/components/Events/actions/events'
type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const event = await queryEventByID({ id: id })

  if (!event) return <h1 className="text-3xl">Event not found</h1>

  const user = await getUser()

  const isOwner =
    (typeof event?.owner === 'string' ? event?.owner : event?.owner.id) === user?.id ? true : false

  return (
    <>
      <Navbar />
      <div className="relative">
        {isOwner && (
          <div className="absolute top-0 right-0 z-50">
            <div>
              <Link href={'/dashboard/event/edit/' + event.id} className=" cursor-pointer">
                <Button>
                  <Edit />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        )}
        {event.eventName && <h1 className="text-3xl">{event.eventName}</h1>}
      </div>
    </>
  )
}

const queryEventByID = cache(async ({ id }: { id: string }) => {
  const page = await getEvent(id)
  return page || null
})
