'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import { getUser } from '@/components/Auth/actions/auth'
import { Event } from '@/payload-types'
import { revalidatePath } from 'next/cache'

type Response = {
  success: boolean
  event?: Event
  error?: string
}

export async function createEvent(
  data: Omit<Event, 'sizes' | 'createdAt' | 'updatedAt' | 'id' | 'owner'>,
): Promise<Response> {
  const payload = await getPayload({ config })

  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a event.' }
  }

  const event: Omit<Event, 'sizes' | 'createdAt' | 'updatedAt' | 'id'> = { ...data, owner: user.id }

  try {
    const newEvent = await payload.create({
      collection: 'events',
      data: event,
    })

    return { success: true, event: newEvent }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating event' }
  }
}

export async function updateEvent(
  event: Partial<Omit<Event, 'id'>> & Pick<Event, 'id'>,
): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a event.' }
  }

  try {
    const result = await payload.update({
      collection: 'events',
      id: event.id,
      data: event,
      depth: 2,
      user: user.id,
      overrideAccess: false,
      overrideLock: false,
    })

    revalidatePath('/event/' + event.id)
    return { success: true, event: result }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}

export async function getEvent(eventId: string): Promise<Event | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    pagination: false,
    where: {
      id: {
        equals: eventId,
      },
      deleted: { equals: false },
    },
  })

  return result.docs[0] || null
}

export async function getLocation(address: string) {
  const locationIqKey = process.env.LocationIQ_API_KEY

  const GEOCODING_API_URL = `https://eu1.locationiq.com/v1/search?q=${encodeURIComponent(address)}&format=json&key=${locationIqKey}`

  try {
    const response = await fetch(GEOCODING_API_URL)
    const data = await response.json()
    console.log(data)

    if (data.length > 0) {
      const location = data
      return location
    } else {
      console.error('Geocoding API error:', data)
      return null
    }
  } catch (error) {
    console.error('Error fetching location:', error)
    return null
  }
}
