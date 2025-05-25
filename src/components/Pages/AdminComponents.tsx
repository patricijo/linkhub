'use client'

import { useEffect, useState } from 'react'

import { useMotionValue, Reorder, useDragControls } from 'framer-motion'
import { useRaisedShadow } from '../../hooks/use-raised-shadow'

import { Page } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import RenderContent from './RenderComponents'
import { Edit, GripVertical } from 'lucide-react'
import DynamicBackend from './DynamicBackend'
import AddContent from './AddContent'
import { saveSort } from './components/actions/components'

export type SortableContent = NonNullable<Page['content']>[number]
type Props = {
  componentItems: Page['content']
  page: Page
}

export function AdminComponents({ componentItems, page }: Props) {
  const [items, setItems] = useState<SortableContent[]>(componentItems ? componentItems : [])

  const [loadSaveOrder, setLoadSaveOrder] = useState(false)

  const initialItems = componentItems ? componentItems : []

  useEffect(() => {
    if (componentItems) {
      setItems(componentItems)
    }
  }, [componentItems, setItems])

  const hasOrderChanged = () => {
    if (items.length !== initialItems.length) return true
    return items.some((item, index) => {
      if (typeof item.value === 'string' || typeof initialItems[index].value === 'string')
        return false
      return item.value.id !== initialItems[index].value.id
    })
  }
  const saveOrder = async () => {
    setLoadSaveOrder(true)
    const orderedPage = {
      ...page,
      content: items,
    }
    await saveSort(orderedPage)
    setLoadSaveOrder(false)
  }

  return (
    <>
      {hasOrderChanged() && (
        <div className="place-self-end">
          <div className="flex space-x-4">
            {loadSaveOrder ? (
              <>Saving...</>
            ) : (
              <>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    setItems(initialItems)
                  }}
                >
                  Reset
                </Button>
                <Button onClick={saveOrder}>Save</Button>
              </>
            )}
          </div>
        </div>
      )}
      <Reorder.Group
        axis="y"
        onReorder={setItems}
        values={items}
        className="select-none relative space-y-4 w-full"
      >
        {items.map(
          (item) =>
            typeof item.value !== 'string' && <Item key={item.value.id} item={item} page={page} />,
        )}
      </Reorder.Group>
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
        className=" absolute -left-8 top-4 cursor-grab  active:cursor-grabbing"
        onPointerDown={(event) => dragControls.start(event)}
      >
        <GripVertical size={20} />
      </div>
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
    </Reorder.Item>
  )
}
