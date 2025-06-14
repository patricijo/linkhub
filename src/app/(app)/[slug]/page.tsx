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
type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (!slug.startsWith('%40')) return null

  const pageName = slug.slice(3)

  const page = await queryPageBySlug({ slug: pageName })

  if (!page) return <h1 className="text-3xl">Page not found</h1>

  const user = await getUser()

  const isOwner =
    (typeof page?.owner === 'string' ? page?.owner : page?.owner.id) === user?.id ? true : false

  return (
    <>
      <Navbar />
      <div className="relative">
        {isOwner && (
          <div className="absolute top-0 right-0 z-50">
            <div>
              <Link href={'/dashboard/page/@' + page.pageName} className=" cursor-pointer">
                <Button>
                  <Edit />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        )}
        <RenderPage page={page} isOwner={false} />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pageName = slug.slice(3)
  if (!slug.startsWith('%40')) return {}

  const page = await queryPageBySlug({ slug: pageName })
  return {
    title: 'LinkHub | ' + page?.name || 'LinkHub | ' + page?.pageName,
    description: page?.description,
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const page = await getPage(slug)
  return page || null
})
