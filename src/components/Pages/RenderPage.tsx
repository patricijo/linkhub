import { Page } from '@/payload-types'
import Image from 'next/image'

import HeaderLinks from './HeaderLinks'
import RenderContent from './RenderComponents'
import { Button } from '../ui/button'
import { ArrowBigDownDash, ArrowBigUpDash, Edit, Eye, Trash2, Upload } from 'lucide-react'
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
import { PageForm } from './PageForm'
import { ImageForm } from './ImageForm'
import DynamicBackend from './DynamicBackend'

export async function RenderPage({
  className,
  page,
  isOwner,
  ...props
}: React.ComponentProps<'div'> & { page: Page; isOwner: boolean }) {
  return (
    <>
      <div className="mb-16 text-center flex flex-col items-center space-y-4  w-full relative">
        {isOwner && (
          <div className="absolute right-0 top-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Edit /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit @{page.pageName}</DialogTitle>
                </DialogHeader>
                <PageForm page={page} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        {page.profilePicture &&
        typeof page.profilePicture !== 'string' &&
        typeof page.profilePicture &&
        page.profilePicture.sizes?.thumbnail?.url ? (
          <div className="relative">
            <div className="rounded-full border-4 overflow-hidden border-white shadow-lg w-[150px] h-[150px] items-center content-center justify-center">
              <Image
                src={page.profilePicture.sizes?.thumbnail?.url}
                alt="Profile Picture"
                width={150}
                height={150}
              />
            </div>
            {isOwner && (
              <Dialog>
                <DialogTrigger>
                  <div className="bg-gray-700 rounded-full p-2 text-white absolute top-2 right-2">
                    <Upload size={12} />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Picture</DialogTitle>
                  </DialogHeader>
                  <ImageForm page={page} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          isOwner && (
            <div className="rounded-full border-4 border-white shadow-lg w-[150px] h-[150px] overflow-hidden items-center content-center justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload /> Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Picture</DialogTitle>
                  </DialogHeader>
                  <ImageForm page={page} />
                </DialogContent>
              </Dialog>
            </div>
          )
        )}
        <div>
          <h1 className="text-3xl font-bold ">{page.name ? page.name : page.pageName}</h1>
          <h3 className="text-xl font-bold ">@{page.pageName}</h3>
        </div>
        <p className="text-xl opacity-80">{page.description && page.description}</p>{' '}
        <div className=" py-4">
          <HeaderLinks page={page} isOwner={isOwner} />
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
                          <DynamicBackend component={content} page={page} />
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
