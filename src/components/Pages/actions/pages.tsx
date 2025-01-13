'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import { getUser } from '@/components/Auth/actions/auth'
import { Page } from '@/payload-types'

type Response = {
  success: boolean
  error?: string
}

export async function createPage({ pageName }: { pageName: string }): Promise<Response> {
  const payload = await getPayload({ config })

  const user = await getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a page.' }
  }

  try {
    await payload.create({
      collection: 'pages',
      data: { pageName, owner: user.id },
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
