'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Page } from '@/payload-types'
import { Label } from '../ui/label'
import { AddressAutofill, AddressMinimap } from '@mapbox/search-js-react'
import { createPage, deletePage, updatePage } from '../Pages/actions/pages'
import { Suspense, useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Checkbox } from '../ui/checkbox'
import { Calendar } from '../ui/calendar'
import { DateRange } from 'react-day-picker'
import { Clock2Icon } from 'lucide-react'

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

export function EventForm({
  page,
  className,
  ...props
}: React.ComponentProps<'div'> & { page?: Page }) {
  const router = useRouter()

  const [minimapFeature, setMinimapFeature] = useState(null)
  const [isLocal, setIsLocal] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSelectedImage(null)
  }, [isLocal, isOnline])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
    }
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const result = page ? await updatePage({ ...page, ...data }) : await createPage(data)

      if (result.success) {
        router.push(`/dashboard/page/@${data.pageName}`)
      } else {
        setError('pageName', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }
  const handleAutofillRetrieve = (response: { features: Array<any> }) => {
    setMinimapFeature(response.features[0])
    console.log(response)
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>Eventname</Label>
          <Input
            {...register('name')}
            id="name"
            className=" w-full"
            placeholder="name"
            defaultValue={page?.name || ''}
          />
          {errors.name && <div className="text-red-500 text-xs  ml-2">{errors.name.message}</div>}
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
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
        </div>
        <Label>Event Date</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-lg border shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex w-full flex-col gap-3">
              <Label htmlFor="time-from">Start Time</Label>
              <div className="relative flex w-full items-center gap-2">
                <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                <Input
                  id="time-from"
                  type="time"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <Label htmlFor="time-to">End Time</Label>
              <div className="relative flex w-full items-center gap-2">
                <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                <Input
                  id="time-to"
                  type="time"
                  step="1"
                  defaultValue="12:30:00"
                  className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="w-full aspect-[3/1] overflow-hidden rounded-sm bg-slate-100">
          {selectedImage && (
            <img src={selectedImage} alt="Selected Event Image" className="min-w-full min-h-full" />
          )}
        </div>
        <div>
          <Label>Event Type</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
            <Checkbox
              id="onlineEvent"
              onCheckedChange={(checked) => setIsOnline(!!checked)}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">Online Event</p>
              <p className="text-muted-foreground text-sm">
                You can enable or disable notifications at any time.
              </p>
            </div>
          </Label>
          <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
            <Checkbox
              id="localEvent"
              onCheckedChange={(checked) => setIsLocal(!!checked)}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">Local Event</p>
              <p className="text-muted-foreground text-sm">
                You can enable or disable notifications at any time.
              </p>
            </div>
          </Label>
        </div>
        {isLocal && (
          <>
            <div className="space-y-2">
              <Label>Event Address</Label>
              <div>
                <AddressAutofill
                  accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''}
                  onRetrieve={handleAutofillRetrieve}
                  confirmOnBrowserAutofill
                >
                  <Input type="text" name="address" autoComplete="street-address" />
                </AddressAutofill>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="txt-s txt-bold color-gray mb3">
                Apartment, suite, etc. (optional)
              </Label>
              <Input autoComplete="address-line2" name="address-line2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="txt-s txt-bold color-gray mb3">
                  City
                  <Input
                    className="input mb12"
                    autoComplete="address-level2"
                    name="address-level2"
                    required
                    disabled
                  />
                </Label>
              </div>
              <div>
                <Label className="txt-s txt-bold color-gray mb3">
                  State / Region
                  <Input
                    className="input mb12"
                    autoComplete="address-level1"
                    name="address-level1"
                    required
                    disabled
                  />
                </Label>
              </div>
              <div>
                <Label className="txt-s txt-bold color-gray mb3">
                  ZIP / Postcode
                  <Input
                    className="input"
                    autoComplete="postal-code"
                    name="postal-code"
                    required
                    disabled
                  />
                </Label>
              </div>
            </div>
            <div
              id="minimap-container"
              className={clsx(
                'h-80 w-full relative mt-18 mb-60 bg-slate-100 content-center justify-center rounded-sm',
              )}
            >
              {minimapFeature ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <AddressMinimap
                    feature={minimapFeature}
                    show={true}
                    satelliteToggle
                    canAdjustMarker
                    footer
                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''}
                  />
                </Suspense>
              ) : (
                <div className="text-center">Please select an address to view map</div>
              )}
            </div>
          </>
        )}

        {isOnline && (
          <div className="space-y-2">
            <Label>Event URL</Label>
            <Input type="text" name="url" />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
          {page ? 'Update Page' : 'Create Page'}
        </Button>
      </form>
      {page && (
        <Button
          onClick={async () => {
            const result = await deletePage(page)
            if (result.success) {
              router.push('/dashboard')
            }
          }}
          variant="destructive"
        >
          Delete page
        </Button>
      )}
    </>
  )
}
