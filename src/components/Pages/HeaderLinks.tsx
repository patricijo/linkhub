import React from 'react'
import { Edit, Globe, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
import { checkUrl, createUrl } from './urlCheck'

const HeaderLinks = ({ page }: { page: Page }) => {
  const isOwner = true
  return (
    <>
      <div className="flex gap-6">
        {page.socials?.map((link, index) => {
          const Icon = checkUrl(link.url).icon
          return (
            <div key={link.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group bg-white rounded-full text-gray-700 shadow-lg border border-gray-100 hover:-translate-y-3 hover:shadow-xl  transition-all duration-200 relative">
                    <Link href={link.url}>
                      <button className="p-4">
                        <Icon
                          className="transition-transform duration-200 group-hover:scale-110"
                          size={34}
                        />
                      </button>
                    </Link>
                    {isOwner && (
                      <>
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
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="mt-2">
                  <p>{link.label}</p>
                </TooltipContent>
                <TooltipContent side="bottom" className=" text-grey-600 mt-10 bg-gray-300">
                  <p>{link.url}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )
        })}
        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>Open the dialog</TooltipContent>
          </Tooltip>
        )}
      </div>
    </>
  )
}

export default HeaderLinks
