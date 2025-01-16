'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ComponentCollections } from '@/collections/Pages'
import { Page } from '@/payload-types'

const components = ComponentCollections

function AddContent({ page }: { page: Page }) {
  const [currentComponent, setCurrentComponent] = useState<string | null>(null)

  const BackendComponent = () => {
    if (currentComponent) {
      const DynamicComponent = dynamic(
        () =>
          import(
            `@/components/Pages/components/${currentComponent[0].toUpperCase() + currentComponent.slice(1)}/Backend`
          ),
        {
          loading: () => <p>Loading...</p>,
        },
      )
      //@ts-expect-error
      return <DynamicComponent page={page} />
    }
    return null
  }

  return (
    <div className="mt-4 w-full">
      <Dialog onOpenChange={() => setCurrentComponent(null)}>
        <DialogTrigger asChild>
          <Button className={'w-full'} size={'lg'}>
            <Plus />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] space-y-4">
          <DialogHeader>
            <DialogTitle>Add Content</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {!currentComponent ? (
            components.map((collection, index) => {
              return (
                <Card key={index} onClick={() => setCurrentComponent(collection.slug)}>
                  <CardHeader>{collection.labels?.singular as string} </CardHeader>
                  <CardContent>{collection.custom?.description}</CardContent>
                </Card>
              )
            })
          ) : (
            <BackendComponent />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddContent
