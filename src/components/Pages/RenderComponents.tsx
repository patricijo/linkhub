'use server'

import { Page } from '@/payload-types'
import PageLinksComponent from './components/PageLinks/Frontend'

type ContentElement = NonNullable<Page['content']>[number]

function RenderContent({ content, isOwner }: { content: ContentElement; isOwner: boolean }) {
  switch (content.relationTo) {
    case 'pageLinks':
      return <PageLinksComponent pageLink={content.value} isOwner={isOwner} />
    default:
      return null
  }
}

export default RenderContent
