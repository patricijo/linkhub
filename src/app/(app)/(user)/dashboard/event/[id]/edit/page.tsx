import { getUser } from '@/components/Auth/actions/auth'
import { getEvent } from '@/components/Events/actions/events'
import { EventForm } from '@/components/Events/EventForm'
import { getPage } from '@/components/Pages/actions/pages'
import { PageForm } from '@/components/Pages/PageForm'
type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const event = await getEvent(id)

  const user = await getUser()

  const isOwner =
    (typeof event?.owner === 'string' ? event?.owner : event?.owner.id) === user?.id ? true : false

  if (!event || !isOwner) return <h1 className="text-3xl">Page not found</h1>

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <EventForm event={event} />
      </div>
    </div>
  )
}
