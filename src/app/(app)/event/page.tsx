import { EventSearch } from '@/components/Events/EventSearch'

type Props = {
  params: Promise<{}>
}

export default async function Page({ params }: Props) {
  return (
    <>
      <EventSearch />
    </>
  )
}
