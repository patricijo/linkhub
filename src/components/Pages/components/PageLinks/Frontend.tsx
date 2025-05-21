import { PageLink } from '@/payload-types'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { checkUrl } from '../../urlCheck'

function PageLinksComponent({ pageLink }: { pageLink: PageLink | string; isOwner: boolean }) {
  if (typeof pageLink === 'string') {
    return
  }
  const Icon = checkUrl(pageLink.url).icon
  return (
    <Link href={pageLink.url} target="_blank">
      <div className="shadow-sm rounded-xl w-full text-lg p-4 bg-white text-slate-600  transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-md">
        <div className="w-full flex items-center">
          <div>
            <Icon />
          </div>
          <div className=" flex-auto">
            <div className="text-xl">{pageLink.label || pageLink.url}</div>
            {pageLink.description && <div className="text-slate-400">{pageLink.description}</div>}
          </div>
          <div>
            <ExternalLink size={24} className="ml-2 opacity-70" />
          </div>
        </div>
      </div>
      <div className="bg-slate-900 w-auto absolute mt-0 py-0 px-0 overflow-hidden text-sm rounded-full z-40 left-1/2 transform -translate-x-1/2 h-0 text-white group-hover:h-10 group-hover:py-2 group-hover:px-4 group-hover:mt-[-10px]  shadow-md transition-all duration-900 ease-in-out">
        {pageLink.url}
      </div>
    </Link>
  )
}

export default PageLinksComponent
