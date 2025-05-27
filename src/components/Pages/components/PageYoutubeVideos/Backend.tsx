'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Page, PageLink } from '@/payload-types'
import { createComponent, deleteComponent, updateComponent } from '../actions/components'
import { Label } from '@/components/ui/label'
import { checkUrl, createUrl } from '../../urlCheck'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash } from 'lucide-react'

const schema = z.object({
  url: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/,
      'enter a valid Youtube url',
    ),
})

type FormFields = z.infer<typeof schema>
function Backend({ component, page }: { component?: PageLink; page: Page }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const result = component
        ? await updateComponent({
            component: { ...component, ...data },
            componentSlug: 'pageYoutubeVideos',
            page,
          })
        : await createComponent({ data, componentSlug: 'pageYoutubeVideos', page })

      if (result.success) {
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const onDelete = async ({ component }: { component: PageLink }) => {
    try {
      const result = await deleteComponent({
        component: component,
        componentSlug: 'pageYoutubeVideos',
        page: page,
      })

      if (result.success) {
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const url = watch('url') || (component && component.url) || ''

  const checkedUrl = checkUrl(createUrl(url))

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>Url</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
            {checkedUrl?.icon && <checkedUrl.icon size={18} />}
          </span>
          <Input
            {...register('url')}
            required
            id="url"
            className="pl-8 w-full"
            placeholder="https://www.google.de"
            defaultValue={component?.url}
          />
        </div>
        {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}
      </div>

      <div className="flex space-x-4">
        {component && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant={'destructive'}>
                  <Trash size={34} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete video</DialogTitle>
                  <DialogDescription>Are you sure?</DialogDescription>
                </DialogHeader>
                <div className="flex space-x-4">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant={'destructive'}
                    onClick={() => {
                      onDelete({ component })
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid || checkedUrl.error != null}
        >
          {component ? 'Save Video' : 'Create Video'}
        </Button>
      </div>
    </form>
  )
}
export default Backend
