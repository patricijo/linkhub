import { Page } from '@/payload-types'
import Image from 'next/image'
import { usePages } from './Provider'

export function RenderPage({
  className,
  page,
  ...props
}: React.ComponentProps<'div'> & { page: Page }) {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="mb-4">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{page.name ? page.name : page.pageName}</h1>
            <h3 className="text-xl font-bold mb-2">@{page.pageName}</h3>
            <p className="text-xl opacity-80">{page.description && page.description}</p>
            <div className="w-full max-w-sm md:max-w-3xl space-y-4 "></div>
          </div>
        </div>
      </div>
    </>
  )
}
