'use server'

import { Button } from '@/components/ui/button'
import { PageLink } from '@/payload-types'
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  Edit,
  ExternalLink,
  Eye,
  Instagram,
  Trash2,
  WholeWord,
} from 'lucide-react'
import Link from 'next/link'
import { checkUrl } from '../../urlCheck'

async function PageLinksComponent({
  pageLink,
  isOwner,
}: {
  pageLink: PageLink | string
  isOwner: boolean
}) {
  // sollte eigentlich nicht relevant
  if (typeof pageLink === 'string') {
    return
  }
  const Icon = checkUrl(pageLink.url).icon
  return (
    <Link href={pageLink.url} target="_blank">
      <div className="shadow-sm rounded-xl w-full text-lg p-4 bg-white text-slate-600 group-hover:bg-slate-100 transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-md">
        <div className="w-full flex items-center">
          <div>
            <Icon />
          </div>
          <div className=" flex-auto">
            <div className="text-xl">{pageLink.label}</div>
            {pageLink.description && <div className="text-slate-400">{pageLink.description}</div>}
          </div>
          <div>
            <ExternalLink size={24} className="ml-2 opacity-70" />
          </div>
        </div>
      </div>
      <div className="bg-slate-900 w-auto absolute mt-0 py-0 px-0 overflow-hidden text-sm rounded-full z-40 left-1/2 transform -translate-x-1/2 h-0 text-white group-hover:h-10 group-hover:py-2 group-hover:px-4 group-hover:mt-[-10px]  hadow-md transition-all duration-900 ease-in-out">
        {pageLink.url}
      </div>
    </Link>
  )
}

export default PageLinksComponent
