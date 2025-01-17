import { PageForm } from '@/components/Pages/PageForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function Page() {
  return (
    <Card>
      <CardHeader className=" text-xl font-medium">Create a new page</CardHeader>
      <CardContent>
        <PageForm />
      </CardContent>
    </Card>
  )
}
