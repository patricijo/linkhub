'use client'

import { usePages } from '@/components/Pages/Provider'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page() {
  const { pages } = usePages()

  if (!pages[0]) {
    redirect('/dashboard/page/create')
    return null
  }

  const renderPages = pages.map((page) => {
    return (
      <Card key={page.id}>
        <CardHeader>
          <div className="flex space-x-3 justify-items-center">
            {page.profilePicture &&
              typeof page.profilePicture !== 'string' &&
              typeof page.profilePicture &&
              page.profilePicture.sizes?.thumbnail?.url && (
                <div className="rounded-full border-4 overflow-hidden border-white shadow-lg w-[60px] h-[60px] items-center content-center justify-center">
                  <Image
                    src={page.profilePicture.sizes?.thumbnail?.url}
                    alt="Profile Picture"
                    width={60}
                    height={60}
                  />
                </div>
              )}
            <div>
              <div>@ {page.pageName}</div>
              <div className="text-3xl">{page.name}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>{page.description}</CardContent>
        <CardFooter>
          <div className="space-x-3 flex right-0 ">
            <Link href={'/@' + page.pageName}>
              <Button>View</Button>
            </Link>
            <Link href={'/dashboard/page/@' + page.pageName}>
              <Button>Edit</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    )
  })

  return <div className="space-y-6">{renderPages}</div>
}
