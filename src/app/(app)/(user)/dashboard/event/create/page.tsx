import { EventForm } from '@/components/Events/EventForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <Card>
      <CardHeader className=" text-xl font-medium">Create a new event</CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <EventForm />
        </Suspense>
      </CardContent>
    </Card>
  )
}
