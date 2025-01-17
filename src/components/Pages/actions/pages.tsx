'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import { getUser } from '@/components/Auth/actions/auth'
import { Page } from '@/payload-types'

type Response = {
  success: boolean
  page?: Page
  error?: string
}

export async function createPage(
  data: Omit<Page, 'sizes' | 'createdAt' | 'updatedAt' | 'id' | 'owner'>,
): Promise<Response> {
  const payload = await getPayload({ config })

  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  const page: Omit<Page, 'sizes' | 'createdAt' | 'updatedAt' | 'id'> = { ...data, owner: user.id }

  try {
    await payload.create({
      collection: 'pages',
      data: page,
    })

    return { success: true }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}

export async function getPages(): Promise<Page[]> {
  const payload = await getPayload({ config })

  const user = await getUser()

  if (!user) {
    return []
  }

  const result = await payload.find({
    collection: 'pages', // required
    depth: 2,

    pagination: false,
    where: {
      owner: { equals: user.id },
    }, // pass a `where` query here
    sort: 'createdAt: -1', // pass a `sort` query here
    fallbackLocale: false,
  })

  return result.docs
}

export async function getPage(pageName: string): Promise<Page | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    pagination: false,
    where: {
      pageName: { equals: pageName },
    },
  })

  return result.docs[0] || null
}

export async function updatePage(
  page: Partial<Omit<Page, 'id'>> & Pick<Page, 'id'>,
): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  try {
    const result = await payload.update({
      collection: 'pages', // required
      id: page.id, // required
      data: page,
      depth: 2,
      user: user.id,
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    return { success: true, page: result }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}

export async function uploadPicture({ file, page }: { file: File; page: Page }): Promise<Response> {
  const payload = await getPayload({ config })
  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  const data = await file.arrayBuffer()

  try {
    const media = await payload.create({
      collection: 'media', // required
      data: { alt: 'Profile Picture' },

      user: user.id,

      // Alternatively, you can directly pass a File,
      // if file is provided, filePath will be omitted
      file: {
        data: Buffer.from(data),
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    await payload.update({
      collection: 'pages', // required
      id: page.id, // required
      data: { profilePicture: media },
      depth: 2,
      user: user.id,
      overrideAccess: false,
      overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
    })

    return { success: true }
  } catch (error) {
    console.error('Creating Error', error)
    return { success: false, error: 'Error creating page' }
  }
}
