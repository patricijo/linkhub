'use client'

import { useState } from 'react'

import { useMotionValue, Reorder, useDragControls } from 'framer-motion'
import { useRaisedShadow } from '../../../hooks/use-raised-shadow'

import { Page } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import RenderContent from '../RenderComponents'
import { Edit, GripVertical } from 'lucide-react'
import DynamicBackend from '../DynamicBackend'
import AddContent from './AddContent'

export type SortableContent = NonNullable<Page['content']>[number]
type Props = {
  page: Page
  items: SortableContent[]
  setItems: React.Dispatch<React.SetStateAction<SortableContent[]>>
}

export function EditComponents({ page, items, setItems }: Props) {
  return (
    <>
      {items.length === 0 ? (
        <div className="flex items-center justify-center text-center w-full h-32 bg-gray-200 rounded-xl">
          Add your links or components
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          onReorder={setItems}
          values={items}
          className="select-none relative space-y-4 w-full"
        >
          {items.map(
            (item) =>
              typeof item.value !== 'string' && (
                <Item key={item.value.id} item={item} page={page} />
              ),
          )}
        </Reorder.Group>
      )}

      <AddContent page={page} />
    </>
  )
}

const Item = ({ item, page }: { item: SortableContent; page: Page }) => {
  const [isOpen, setIsOpen] = useState(false)

  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  const handleClose = () => {
    setIsOpen(false)
  }
  if (typeof item.value === 'string') return null
  return (
    <Reorder.Item
      value={item}
      id={item.value.id}
      dragListener={false}
      dragControls={dragControls}
      className="relative flex w-full rounded-xl "
      style={{ boxShadow, y }}
    >
      <div
        className="cursor-grab  active:cursor-grabbing p-4 touch-none"
        onPointerDown={(event) => {
          event.preventDefault()
          dragControls.start(event)
        }}
      >
        <GripVertical size={20} />
      </div>
      <div className="w-full">
        <div className="absolute -right-2 -top-2 z-50">
          <Button
            variant="default"
            size={'icon'}
            className="rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <Edit />
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              {typeof item.value != 'string' && (
                <DynamicBackend component={item} page={page} onClose={handleClose} />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <RenderContent content={item} isOwner={true} />
      </div>
    </Reorder.Item>
  )
}
