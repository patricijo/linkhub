'use server'

import { CollectionSlug, getPayload } from 'payload'
import config from '@payload-config'

import { getUser } from '@/components/Auth/actions/auth'
import { Page, PageLink } from '@/payload-types'
import { number } from 'zod'
import { revalidatePath } from 'next/cache'

type Collection = NonNullable<Page['content']>[number]['value']

type Response = {
  success: boolean
  component?: Collection
  error?: string
}

export async function createComponent({
  data,
  componentSlug,
  page,
}: {
  data: Omit<Collection, 'sizes' | 'createdAt' | 'updatedAt' | 'owner'>
  componentSlug: CollectionSlug
  page: Page
}): Promise<Response> {
  const payload = await getPayload({ config })

  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a Component.' }
  }

  const component: Omit<Collection, 'sizes' | 'createdAt' | 'updatedAt' | 'id'> = {
    ...data,
    owner: user.id,
  }

  try {
    const content = await payload.create({
      collection: componentSlug,
      data: component,
    })

    await payload.update({
      collection: 'pages', // required
      id: page.id, // required
      user: user.id,
      data: {
        content: [
          ...(page.content || []),
          {
            relationTo: componentSlug as NonNullable<Page['content']>[number]['relationTo'],
            value: content.id,
          },
        ],
      },
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })
    revalidatePath('/dashboard/page/@' + page.pageName)
    revalidatePath('/@' + page.pageName)
    return { success: true }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating component' }
  }
}

export async function updateComponent({
  component,
  componentSlug,
  page,
}: {
  component: Partial<Omit<PageLink, 'id'>> & Pick<PageLink, 'id'>
  componentSlug: CollectionSlug
  page: Page
}): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  try {
    const result = await payload.update({
      collection: componentSlug, // required
      id: component.id, // required
      data: component,
      depth: 2,
      user: user.id,
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    revalidatePath('/@' + page.pageName)
    revalidatePath('/dashboard/page/@' + page.pageName)
    return { success: true, component: result as Collection }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}

export async function deleteComponent({
  component,
  componentSlug,
  page,
}: {
  component: Partial<Omit<PageLink, 'id'>> & Pick<PageLink, 'id'>
  componentSlug: CollectionSlug
  page: Page
}): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  try {
    await payload.delete({
      collection: componentSlug, // required
      id: component.id, // required
      depth: 2,
      user: user.id,
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    const updatedRelations = page.content?.filter((relatedId) => relatedId.value !== component)

    await payload.update({
      collection: 'pages', // required
      id: page.id, // required
      user: user.id,
      data: {
        content: updatedRelations,
      },
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    revalidatePath('/@' + page.pageName)
    revalidatePath('/dashboard/page/y@' + page.pageName)
    return { success: true }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}

export async function saveSort(page: Page): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  try {
    await payload.update({
      collection: 'pages', // required
      id: page.id, // required
      user: user.id,
      data: {
        content: page.content,
      },
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    revalidatePath('/@' + page.pageName)

    return { success: true }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}
