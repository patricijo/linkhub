import { Page } from '@/payload-types'
import PageLinksComponent from './components/PageLinks/Frontend'
import PageYoutubesVideoComponent from './components/PageYoutubeVideos/Frontend'

type ContentElement = NonNullable<Page['content']>[number]

function RenderContent({ content, isOwner }: { content: ContentElement | null; isOwner: boolean }) {
  if (!content) {
    return null
  }

  switch (content.relationTo) {
    case 'pageLinks':
      return <PageLinksComponent pageLink={content.value} isOwner={isOwner} />
    case 'pageYoutubeVideos':
      return <PageYoutubesVideoComponent pageYoutubeVideo={content.value} />
    default:
      return null
  }
}

export default RenderContent
