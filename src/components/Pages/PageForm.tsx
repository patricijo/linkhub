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

const schema = z.object({
  pageName: z
    .string()
    .min(3, 'Identifier must be at least 3 characters')
    .max(30, 'Identifier cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Identifier can only contain letters, numbers, underscores, and hyphens',
    ),
  name: z
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

export function PageForm({
  page,
  className,
  ...props
}: React.ComponentProps<'div'> & { page?: Page }) {
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
      const result = page ? await updatePage({ ...page, ...data }) : await createPage(data)

      if (result.success) {
        router.push(`/dashboard/@${data.pageName}`)
      } else {
        setError('pageName', { message: result.error })
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
          {...register('pageName')}
          required
          id="pageName"
          className="pl-8 w-full"
          placeholder="uniqueIdentifier"
          defaultValue={page?.pageName}
        />
      </div>
      {errors.pageName && (
        <div className="text-red-500 text-xs  ml-2">{errors.pageName.message}</div>
      )}
      <Input
        {...register('name')}
        id="name"
        className=" w-full"
        placeholder="name"
        defaultValue={page?.name || ''}
      />
      {errors.name && <div className="text-red-500 text-xs  ml-2">{errors.name.message}</div>}
      <Textarea
        {...register('description')}
        id="description"
        placeholder="Tell us a little bit about yourself"
        className="resize-none"
        defaultValue={page?.description || ''}
      />
      {errors.description && (
        <div className="text-red-500 text-xs  ml-2">{errors.description.message}</div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
        {page ? 'Update Page' : 'Create Page'}
      </Button>
    </form>
  )
}
