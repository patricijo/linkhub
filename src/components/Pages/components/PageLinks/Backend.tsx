'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { useState } from 'react'

const schema = z.object({
  url: z.string(),
  label: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(30, 'Name cannot exceed 30 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(255, 'description cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
})

type FormFields = z.infer<typeof schema>
function Backend({
  component,
  page,
  onClose,
}: {
  component?: PageLink
  page: Page
  onClose: () => void
}) {
  const [loadDelete, setLoadDelete] = useState(false)

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
            componentSlug: 'pageLinks',
            page,
          })
        : await createComponent({ data, componentSlug: 'pageLinks', page })

      if (result.success) {
        onClose()
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const onDelete = async ({ component }: { component: PageLink }) => {
    try {
      setLoadDelete(true)
      const result = await deleteComponent({
        component: component,
        componentSlug: 'pageLinks',
        page: page,
      })

      if (result.success) {
        onClose()
      } else {
        setError('url', { message: result.error })
        setLoadDelete(false)
      }
    } catch (error) {
      console.error('Login error', error)
      setLoadDelete(false)
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

      <div className="space-y-2">
        <Label>Label</Label>
        <Input
          {...register('label')}
          id="label"
          className=" w-full"
          placeholder="label"
          defaultValue={component?.label || ''}
        />
        {errors.label && <div className="text-red-500 text-xs  ml-2">{errors.label.message}</div>}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          {...register('description')}
          id="description"
          placeholder="Tell us a little bit about yourself"
          className="resize-none"
          defaultValue={component?.description || ''}
        />
        {errors.description && (
          <div className="text-red-500 text-xs  ml-2">{errors.description.message}</div>
        )}
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
                  <DialogTitle>Delete link</DialogTitle>
                  <DialogDescription>Are you sure?</DialogDescription>
                </DialogHeader>
                {loadDelete ? (
                  <>Loading...</>
                ) : (
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
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid || checkedUrl.error != null}
        >
          {component ? 'Save Link' : 'Create Link'}
        </Button>
      </div>
    </form>
  )
}
export default Backend
