'use client'

import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { Page } from '@/payload-types'

import { ArrowLeftRight, Edit, GripVertical, Plus } from 'lucide-react'

import { checkUrl } from '../urlCheck'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { HeaderLinkForm } from './HeaderLinksForm'
import { SortableSocials } from './EditPage'
import { useState } from 'react'
import { useRaisedShadow } from '@/hooks/use-raised-shadow'
import { Button } from '@/components/ui/button'

type Props = {
  page: Page
  headerItems: SortableSocials[]
  setHeaderItems: React.Dispatch<React.SetStateAction<SortableSocials[]>>
}
export default function EditHeadLinks({ page, headerItems, setHeaderItems }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenSort, setIsOpenSort] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full justify-center flex gap-4 items-center">
          {headerItems.length > 1 && (
            <>
              <button
                onClick={() => setIsOpenSort(true)}
                className="group p-2 bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeftRight
                  className="transition-transform duration-200 group-hover:scale-110"
                  size={18}
                />
              </button>
              <Dialog open={isOpenSort} onOpenChange={setIsOpenSort}>
                <DialogContent className=" max-h-screen overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Reorder Items</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Reorder.Group
                    axis="y"
                    onReorder={setHeaderItems}
                    values={headerItems}
                    className="gap-4 relative bg-gray-100 p-2 rounded-xl space-y-2 "
                  >
                    {headerItems.map((item) => (
                      <SortableItem item={item} key={item.id} page={page} />
                    ))}
                  </Reorder.Group>
                </DialogContent>
              </Dialog>
            </>
          )}
          {headerItems.length === 0 ? (
            <div className="flex items-center justify-center text-center w-full h-18 px-4 bg-gray-200 rounded-full">
              Show your links here
            </div>
          ) : (
            headerItems.map((item) => <Item item={item} key={item.id} page={page} />)
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="group p-2 bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="transition-transform duration-200 group-hover:scale-110" size={18} />
          </button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new link</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <HeaderLinkForm page={page} onClose={handleClose} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}

const Item = ({ item, page }: { item: SortableSocials; page: Page }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
  }
  const Icon = checkUrl(item.url).icon

  return (
    <div className=" relative ">
      <div className="flex ">
        <div className="group bg-white rounded-full text-gray-700 shadow-lg border border-gray-100 hover:-translate-y-3 hover:shadow-xl  transition-all duration-200 relative">
          <div className="p-4">
            <Icon className="transition-transform duration-200 group-hover:scale-110" size={34} />
          </div>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className=" p-2 bg-gray-700  rounded-full text-white shadow-lg border border-gray-100 absolute right-[-10px] top-0">
            <Edit size={12} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new link</DialogTitle>
            <DialogDescription>This is a description inside the dialog.</DialogDescription>
          </DialogHeader>

          <HeaderLinkForm
            page={page}
            index={page['socials']?.findIndex((socialItem) => socialItem.id === item.id)}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

const SortableItem = ({ item }: { item: SortableSocials; page: Page }) => {
  const Icon = checkUrl(item.url).icon
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      className=" relative flex w-full rounded-xl hover:bg-white"
      style={{ boxShadow, y }}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
    >
      <div
        className=" cursor-grab  active:cursor-grabbing p-4 touch-none"
        onPointerDown={(event) => {
          event.preventDefault()
          dragControls.start(event)
        }}
      >
        <GripVertical size={20} />
      </div>

      <div className="shadow-sm rounded-xl w-full text-lg p-4 bg-white text-slate-600">
        <div className="w-full flex items-center">
          <div>
            <Icon />
          </div>
          <div className=" flex-auto">
            <div className="text-xl">{item.label}</div>
            {item.url}
          </div>
        </div>
      </div>
      <div className="bg-slate-900 w-auto absolute mt-0 py-0 px-0 overflow-hidden text-sm rounded-full z-40 left-1/2 transform -translate-x-1/2 h-0 text-white group-hover:h-10 group-hover:py-2 group-hover:px-4 group-hover:mt-[-10px]  shadow-md transition-all duration-900 ease-in-out"></div>
    </Reorder.Item>
  )
}
