'use client'

import dynamic from 'next/dynamic'
import { Page } from '@/payload-types'

const DynamicBackend = ({
  component,
  page,
}: {
  component: NonNullable<Page['content']>[number]
  page: Page
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
  return <DynamicComponent component={component.value} page={page} />
}

export default DynamicBackend
