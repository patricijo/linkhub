'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from './actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

type FormFields = z.infer<typeof schema>

export function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
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
      const result = await signUp(data)

      if (result.success) {
        router.push('/dashboard')
      } else {
        setError('email', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create a Account</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                />
                {errors.email && (
                  <div className="text-red-500 text-xs  ml-2">{errors.email.message}</div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register('password')} id="password" type="password" required />
                {errors.password && (
                  <div className="text-red-500 text-xs ml-2">{errors.password.message}</div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input {...register('confirmPassword')} id="password" type="password" required />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-xs ml-2">{errors.confirmPassword.message}</div>
                )}
              </div>
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="text-center text-sm">
                Have an account? <Link href="/signin">Login</Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">{/* Image */}</div>
        </CardContent>
      </Card>
    </div>
  )
}
