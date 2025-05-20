import React from 'react'
import { Edit, Plus } from 'lucide-react'

import { Page } from '@/payload-types'

import Link from 'next/link'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { HeaderLinkForm } from './HeaderLinksForm'
import { checkUrl } from './urlCheck'

const HeaderLinks = ({ page, isOwner }: { page: Page; isOwner: boolean }) => {
  return (
    <>
      <div className="flex gap-6">
        {page.socials?.map((link, index) => {
          const Icon = checkUrl(link.url).icon
          return (
            <div key={link.id}>
              <div className="group z-50 bg-white rounded-full text-gray-700 shadow-lg border border-gray-100 hover:-translate-y-3 hover:shadow-xl  transition-all duration-200 relative">
                <Link href={link.url} target="_blank">
                  <button className="p-4">
                    <Icon
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={34}
                    />
                  </button>
                </Link>
                {isOwner && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className=" p-2 bg-gray-700  rounded-full text-white shadow-lg border border-gray-100 absolute right-[-10px] top-0">
                        <Edit size={12} />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new link</DialogTitle>
                        <DialogDescription>
                          This is a description inside the dialog.
                        </DialogDescription>
                      </DialogHeader>
                      <HeaderLinkForm page={page} index={index} />
                    </DialogContent>
                  </Dialog>
                )}
                <div className="bg-slate-900 w-auto absolute  py-0 px-0 overflow-hidden text-sm rounded-full z-40 left-1/2 transform -translate-x-1/2 h-0 text-white group-hover:h-auto group-hover:px-2 group-hover:py-1 group-hover:mt-2 shadow-md transition-all duration-900 ease-in-out">
                  {link.label}
                </div>

                <div className="bg-gray-300 w-auto absolute py-0 px-0 overflow-hidden text-xs rounded-full z-40 left-1/2 transform -translate-x-1/2 h-0 text-grey-700  group-hover:h-auto  group-hover:px-2 group-hover:py-1  group-hover:mt-10  shadow-md transition-all duration-900 ease-in-out whitespace-nowrap">
                  {link.url}
                </div>
              </div>
            </div>
          )
        })}
        {isOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="group p-4 bg-gray-100 border-white border-2 rounded-full text-gray-700 shadow-lg  hover:-translate-y-3 hover:shadow-xl transition-all duration-200">
                <Plus
                  className="transition-transform duration-200 group-hover:scale-110"
                  size={34}
                />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new link</DialogTitle>
                <DialogDescription>This is a description inside the dialog.</DialogDescription>
              </DialogHeader>
              <HeaderLinkForm page={page} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}

export default HeaderLinks
