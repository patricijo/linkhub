'use client'

import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { uploadPicture } from './actions/pages'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

import { Page } from '@/payload-types'
import { Label } from '../ui/label'

const schema = z.object({
  picture: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file type',
  }),
})
type FormFields = z.infer<typeof schema>

export function ImageForm({
  page,
  className,
  ...props
}: React.ComponentProps<'div'> & { page: Page }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      //@ts-expect-error
      const result = await uploadPicture({ file: data.picture[0] as File, page: page })
      if (result.success) {
        router.push(`/dashboard/page/@${page.pageName}`)
      } else {
        setError('picture', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>Profile Picture</Label>

        <Input {...register('picture')} id="picture" type="file" accept="image/*" required />

        {errors.picture && (
          <div className="text-red-500 text-xs  ml-2">{errors.picture.message}</div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Uploading...' : 'Upload Picture'}
      </Button>
    </form>
  )
}
