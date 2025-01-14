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
import { Globe } from 'lucide-react'
import { checkUrl } from './urlCheck'
import { useEffect } from 'react'

const schema = z.object({
  url: z.string().url('Invalid Url'),
  label: z
    .string()
    .min(3, 'Label must be at least 3 characters')
    .max(30, 'Label cannot exceed 30 characters'),
})

type FormFields = z.infer<typeof schema>

export function LinkForm({
  page,
  className,
  ...props
}: React.ComponentProps<'div'> & { page: Page }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const socials = page.socials || []

      socials.push(data)

      const result = await updatePage({ id: page.id, socials: socials })

      if (result.success) {
        router.push(`/dashboard/@${page.pageName}`)
      } else {
        setError('url', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const url = watch('url')
  useEffect(() => {
    alert(JSON.stringify(checkUrl(url)))
  }, [url])

  return (
    <form className="p-6 md:p-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Globe size={16} />
          </span>
          <Input
            {...register('url')}
            required
            id="url"
            className="pl-8 w-full"
            placeholder="http://www.google.de"
          />
        </div>
      </div>
      {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}
      <Input {...register('label')} id="label" className="w-full" placeholder="label" />

      {errors.url && <div className="text-red-500 text-xs  ml-2">{errors.url.message}</div>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {page ? 'Update Page' : 'Create Page'}
      </Button>
    </form>
  )
}
