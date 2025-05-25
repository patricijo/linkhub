'use client'

import dynamic from 'next/dynamic'
import { Page } from '@/payload-types'

const DynamicBackend = ({
  component,
  page,
  onClose,
}: {
  component: NonNullable<Page['content']>[number]
  page: Page
  onClose: () => void
}) => {
  const DynamicComponent = dynamic(
    () =>
      import(
        `@/components/Pages/components/${component['relationTo'][0].toUpperCase() + component['relationTo'].slice(1)}/Backend`
      ),
    {
      loading: () => <p>Loading...</p>,
    },
  )
  //@ts-expect-error
  return <DynamicComponent component={component.value} page={page} onClose={onClose} />
}

export default DynamicBackend
