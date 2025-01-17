import { getUser } from '@/components/Auth/actions/auth'
import { getPage } from '@/components/Pages/actions/pages'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'

export default async function Page() {
  const user = await getUser()

  const page = await getPage('sebastian')

  return (
    <>
      <section className=" text-gray-700 bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-6">LinkHub</h1>
          <h1 className="text-5xl font-bold mb-6">One Page. All Your Links.</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Create your personalized link landing page in seconds. Modern, customizable, and free to
            start.
          </p>
          {user ? (
            <Link href={'/dashboard'}>
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link href={'/signup'}>
              <Button>Create a Account</Button>
            </Link>
          )}
        </div>
      </section>
      <section className=" text-gray-700">
        <div className="container mx-auto px-4 py-20 text-center justify-center">
          <h1 className="text-5xl font-bold mb-8">Want an example?</h1>
        </div>
        <div className=" items-center justify-items-center">
          {page && (
            <Card>
              <Link key={page.id} href={'/@' + page.pageName}>
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
              </Link>
            </Card>
          )}
        </div>
      </section>
    </>
  )
}
