import { getUser } from '@/components/Auth/actions/auth'
import { getPage } from '@/components/Pages/actions/pages'
import { RenderPage } from '@/components/Pages/RenderPage'
import { ActivePage } from '@/components/Pages/ActivePage'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (!slug.startsWith('%40')) return null

  const pageName = slug.slice(3)

  const page = await getPage(pageName)

  const user = await getUser()

  const isOwner =
    (typeof page?.owner === 'string' ? page?.owner : page?.owner.id) === user?.id ? true : false

  if (!page || !isOwner) return <h1 className="text-3xl">Page not found</h1>

  return (
    <>
      <ActivePage page={page} />
      <RenderPage page={page} />
    </>
  )
}
