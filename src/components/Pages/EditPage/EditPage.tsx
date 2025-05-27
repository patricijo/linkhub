'use client'

import { useEffect, useState } from 'react'

import { Page } from '@/payload-types'
import { Button } from '@/components/ui/button'

import { saveSort } from '../components/actions/components'

import { EditComponents } from './EditComponents'
import EditHeadLinks from './EditHeadLinks'
import { Toast } from '@/components/ui/toast'

export type SortableSocials = NonNullable<Page['socials']>[number]
export type SortableContent = NonNullable<Page['content']>[number]

type Props = {
  page: Page
}

export function EditPage({ page }: Props) {
  const [items, setItems] = useState<SortableContent[]>(page['content'] ? page['content'] : [])
  const [headerItems, setHeaderItems] = useState<SortableSocials[]>(
    page['socials'] ? page['socials'] : [],
  )

  const [loadSaveOrder, setLoadSaveOrder] = useState(false)

  const initialItems = page['content'] ? page['content'] : []
  const initialHeaderItems = page['socials'] ? page['socials'] : []

  useEffect(() => {
    setLoadSaveOrder(false)
    setItems(page['content'] ? page['content'] : [])
    setHeaderItems(page['socials'] ? page['socials'] : [])
  }, [page, setItems, setHeaderItems])

  const hasOrderChanged = () => {
    if (items.length !== initialItems.length) return true
    if (headerItems.length !== initialHeaderItems.length) return true
    const itemOrder = items.some((item, index) => {
      if (
        !item.value ||
        typeof item.value === 'string' ||
        typeof initialItems[index].value === 'string'
      )
        return false
      return item.value.id !== initialItems[index].value.id
    })

    const headerItemOrder = headerItems.some((headerItem, index) => {
      if (!headerItem.id) return false
      return headerItem.id !== initialHeaderItems[index].id
    })

    if (itemOrder || headerItemOrder) {
      return true
    }

    return false
  }

  const saveOrder = async () => {
    setLoadSaveOrder(true)
    const orderedPage = {
      ...page,
      socials: headerItems,
      content: items,
    }
    await saveSort(orderedPage)
  }

  return (
    <>
      {hasOrderChanged() && (
        <div
          className="fixed bottom-5 right-5 bg-white rounded-xl shadow-lg"
          style={{
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <div className="flex space-x-4 p-4">
            {loadSaveOrder ? (
              <>Saving...</>
            ) : (
              <>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    setItems(initialItems)
                    setHeaderItems(initialHeaderItems)
                  }}
                >
                  Reset Order
                </Button>
                <Button onClick={saveOrder}>Save Order</Button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="p-4">
        <EditHeadLinks page={page} headerItems={headerItems} setHeaderItems={setHeaderItems} />
      </div>
      <EditComponents page={page} items={items} setItems={setItems} />
    </>
  )
}
