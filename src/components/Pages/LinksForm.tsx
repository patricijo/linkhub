'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createPage, updatePage } from './actions/pages'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Page } from '@/payload-types'
import { Globe, Trash } from 'lucide-react'
import { useEffect } from 'react'
import { checkUrl, createUrl } from './urlCheck'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const schema = z.object({
  url: z.string(),
  label: z
    .string()
    .min(3, 'Label must be at least 3 characters')
    .max(30, 'Label cannot exceed 30 characters'),
})

type FormFields = z.infer<typeof schema>

export function LinkForm({
  page,
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & { page: Page; index?: number }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const socials = page.socials || []

      if (index !== undefined) {
        socials[index] = { ...data }
      } else {
        socials.push({ ...data, url: data.url })
      }

      const result = await updatePage({ id: page.id, socials: socials })
      console.log(result)
      if (result.success) {
        reset()
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const onDelete = async (index: number) => {
    try {
      const socials = page.socials || []

      socials.splice(index, 1)

      const result = await updatePage({ id: page.id, socials: socials })

      if (result.success) {
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const url = watch('url') || (index !== undefined && page.socials && page.socials[index].url) || ''

  const checkedUrl = checkUrl(createUrl(url))

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {checkedUrl?.icon && <checkedUrl.icon size={18} />}
          </span>
          <Input
            {...register('url')}
            required
            id="url"
            className="pl-8 w-full"
            placeholder="https://www.google.de"
            defaultValue={(index !== undefined && page.socials?.[index]?.url) || undefined}
          />
        </div>
      </div>
      {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}
      <Input
        {...register('label')}
        id="label"
        className="w-full"
        placeholder="label"
        defaultValue={(index !== undefined && page.socials?.[index]?.label) || undefined}
      />

      {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}

      <div className="flex space-x-4">
        {index !== undefined && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant={'destructive'}>
                  <Trash size={34} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete link</DialogTitle>
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
                      onDelete(index)
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
          disabled={isSubmitting || checkedUrl.error != null}
        >
          {index !== undefined ? 'Save' : 'Add link'}
        </Button>
      </div>
    </form>
  )
}
