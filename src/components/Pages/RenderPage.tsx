import { Page } from '@/payload-types'
import Image from 'next/image'

import HeaderLinks from './HeaderLinks'
import RenderContent from './RenderComponents'
import { Button } from '../ui/button'
import { ArrowBigDownDash, ArrowBigUpDash, Edit, Eye, Trash2 } from 'lucide-react'
import Backend from './components/PageLinks/Backend'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import AddContent from './AddContent'

export async function RenderPage({
  className,
  page,
  ...props
}: React.ComponentProps<'div'> & { page: Page }) {
  const isOwner = true
  return (
    <>
      <div className="mb-8 text-center flex flex-col items-center space-y-4  w-full">
        <Image
          src="/placeholder.svg?height=150&width=150"
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full border-4 border-white shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold ">{page.name ? page.name : page.pageName}</h1>
          <h3 className="text-xl font-bold ">@{page.pageName}</h3>
        </div>
        <p className="text-xl opacity-80">{page.description && page.description}</p>{' '}
        <div className=" py-4">
          <HeaderLinks page={page} />
        </div>
        {page.content?.map((content, index) => {
          return (
            <div
              key={index + 'content'}
              className={`group justify-center relative w-full ${isOwner && 'hover:pb-12 transition-all'}`}
            >
              <RenderContent content={content} isOwner={true} />
              {isOwner && (
                <>
                  <div className="absolute w-full bottom-0 text-xs bg-slate-900 rounded-lg  group-hover:h-10 h-0 overflow-hidden transition-all duration-600 ease-in-out flex space-x-4 items-center px-4 text-white">
                    <Button variant="ghost" size={'icon'}>
                      <ArrowBigUpDash size={18} />
                    </Button>
                    <Button variant="ghost" size={'icon'}>
                      <ArrowBigDownDash size={18} />
                    </Button>
                    <div className="flex items-center space-x-1">
                      <span>32151</span>
                      <Eye size={18} />
                    </div>
                    <div className="flex-auto" />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size={'icon'}>
                          <Edit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a new link</DialogTitle>
                          <DialogDescription>
                            This is a description inside the dialog.
                          </DialogDescription>
                        </DialogHeader>
                        {typeof content.value != 'string' && (
                          <Backend component={content.value} page={page} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          )
        })}
        {isOwner && <AddContent page={page} />}
      </div>
    </>
  )
}
