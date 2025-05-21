'use client'

import { Reorder } from 'motion/react'
import { Page } from '@/payload-types'
import React, { useState } from 'react'

import RenderContent from '../RenderComponents'
import { ArrowBigUpDash, Edit, Eye, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import DynamicBackend from '../DynamicBackend'

export type SortableContent = NonNullable<Page['content']>[number] & {
  id: string
}

type Props = {
  componentItems: Page['content']
}

export function SortableComponents({ componentItems }: Props) {
  const [items, setItems] = useState<SortableContent[]>(
    componentItems ? componentItems.map((item, index) => ({ ...item, id: `item-${index}` })) : [],
  )

  return (
    <>
      {items && (
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full space-y-4 ">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item} className="w-full flex focus:z-50">
              <div className="w-full flex">
                <div>
                  <GripVertical size={16} className="m-4" />
                  <Edit size={16} className="m-4" />
                </div>

                <div className="w-full group justify-center relative hover:pb-12 transition-all">
                  <RenderContent content={item} isOwner={true} />
                  <>
                    <div className="absolute w-full bottom-0 text-xs bg-slate-900 rounded-lg  group-hover:h-10 h-0 overflow-hidden transition-all duration-600 ease-in-out flex space-x-4 items-center px-4 text-white">
                      <div className="flex items-center space-x-1">
                        <span></span>
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
                          {typeof item.value != 'string' && <DynamicBackend component={item} />}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </>
  )
}
