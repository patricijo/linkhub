'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Page, PageLink } from '@/payload-types'
import { createComponent, updateComponent } from '../actions/components'

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
function Backend({ component, page }: { component?: PageLink; page: Page }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
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
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <form className="pace-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
        <Input
          {...register('url')}
          required
          id="componentName"
          className="pl-8 w-full"
          placeholder="url"
          defaultValue={component?.url}
        />
      </div>
      {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}
      <Input
        {...register('label')}
        id="name"
        className=" w-full"
        placeholder="name"
        defaultValue={component?.label || ''}
      />
      {errors.label && <div className="text-red-500 text-xs  ml-2">{errors.label.message}</div>}

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
      <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
        {component ? 'Update Page' : 'Create Page'}
      </Button>
    </form>
  )
}
export default Backend
