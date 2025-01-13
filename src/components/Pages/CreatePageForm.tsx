'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createPage } from './actions/pages'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const schema = z.object({
  pageName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    ),
  name: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .optional(),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(255, 'Username cannot exceed 30 characters')
    .optional(),
})

type FormFields = z.infer<typeof schema>

export function CreatePageForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const result = await createPage(data)

      if (result.success) {
        router.push(`/@${data.pageName}`)
      } else {
        setError('pageName', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <form className="p-6 md:p-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
        <Input
          {...register('pageName')}
          required
          id="pageName"
          className="pl-8 w-full"
          placeholder="unique name"
        />
      </div>
      {errors.pageName && (
        <div className="text-red-500 text-xs  ml-2">{errors.pageName.message}</div>
      )}
      <Input {...register('name')} required id="name" className=" w-full" placeholder="name" />
      <Textarea
        {...register('description')}
        id="description"
        placeholder="Tell us a little bit about yourself"
        className="resize-none"
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Create Page
      </Button>
    </form>
  )
}
