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
import { Suspense, useState, useEffect } from 'react'
import clsx from 'clsx'
import { Checkbox } from '../ui/checkbox'
import { Calendar } from '../ui/calendar'
import { DateRange } from 'react-day-picker'
import { Clock2Icon } from 'lucide-react'

const schema = z
  .object({
    eventName: z
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
    localEvent: z.boolean().optional(),
    onlineEvent: z.boolean().optional(),
    address: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    eventDate: z.any().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine((data) => data.localEvent || data.onlineEvent, {
    message: 'Mindestens eine der Optionen (Online oder Lokal) muss ausgewählt sein',
    path: ['localEvent'],
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

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  })

  // Aktualisiere die versteckten Felder, wenn sich der Datumsbereich ändert

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  // Function to combine date and time
  const combineDateAndTime = (date: Date | undefined, timeString: string | undefined) => {
    if (!date || !timeString) return date;
    
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, seconds || 0);
    return dateTime;
  };

  // Watch for time input changes
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  // Update dates when dateRange or time changes
  useEffect(() => {
    if (dateRange?.from) {
      const startTimeValue = watchStartTime || '10:30:00';
      setValue('startDate', combineDateAndTime(dateRange.from, startTimeValue));
    }
    
    if (dateRange?.to) {
      const endTimeValue = watchEndTime || '12:30:00';
      setValue('endDate', combineDateAndTime(dateRange.to, endTimeValue));
    }
  }, [dateRange, watchStartTime, watchEndTime, setValue]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log('data', data)
    /*   try {
      const result = page ? await updatePage({ ...page, ...data }) : await createPage(data)

      if (result.success) {
        router.push(`/dashboard/page/@${data.eventName}`)
      } else {
        setError('eventName', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    } */
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
            {...register('eventName')}
            id="eventName"
            className=" w-full"
            placeholder="Whats the name of your event?"
            defaultValue={page?.name || ''}
          />
          {errors.eventName && (
            <div className="text-red-500 text-xs  ml-2">{errors.eventName.message}</div>
          )}
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
        <div>
          <Label>Event Date</Label>
        </div>
        <div className="flex gap-4  items-center place-self-center">
          <div className="">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-lg border shadow-sm"
            />

            {/* Versteckte Felder für Startdatum und Enddatum */}
            <input type="hidden" {...register('startDate')} />
            <input type="hidden" {...register('endDate')} />
          </div>
          <div className="space-y-2">
            <div className="flex w-full flex-col gap-3">
              <Label htmlFor="time-from">Start Time</Label>
              <div className="relative flex w-full items-center gap-2">
                <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                <Input
                  {...register('startTime')}
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
                  {...register('endTime')}
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

        <div>
          <Label>Event Type</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
            <Checkbox
              {...register('onlineEvent')}
              id="onlineEvent"
              onCheckedChange={(checked: boolean) => {
                setIsOnline(!!checked)
                setValue('onlineEvent', !!checked)
                trigger('localEvent')
              }}
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
              {...register('localEvent')}
              id="localEvent"
              onCheckedChange={(checked: boolean) => {
                setIsLocal(!!checked)
                setValue('localEvent', !!checked)
                trigger('localEvent')
              }}
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
        {errors.localEvent && (
          <div className="text-red-500 text-xs ml-2">{errors.localEvent.message}</div>
        )}
        {isLocal && (
          <>
            <div className="space-y-2">
              <Label>Event Address</Label>
              <div>
                {/* @ts-ignore */}
                <AddressAutofill
                  accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''}
                  onRetrieve={handleAutofillRetrieve}
                  confirmOnBrowserAutofill
                >
                  <Input
                    {...register('address')}
                    type="text"
                    name="address"
                    autoComplete="street-address"
                  />
                </AddressAutofill>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="txt-s txt-bold color-gray mb3">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                {...register('addressLine2')}
                autoComplete="address-line2"
                name="address-line2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="txt-s txt-bold color-gray mb3">
                  City
                  <Input
                    {...register('city')}
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
                    {...register('state')}
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
                    {...register('postalCode')}
                    className="input mb12"
                    autoComplete="postal-code"
                    name="postal-code"
                    required
                    disabled
                  />
                </Label>
              </div>
            </div>
            <div>
              <Label className="txt-s txt-bold color-gray mb3">
                Country
                <Input
                  {...register('country')}
                  className="input mb12"
                  autoComplete="country"
                  name="country"
                  required
                />
              </Label>
            </div>
            <div
              id="minimap-container"
              className={clsx(
                'h-80 w-full relative mt-18 mb-60 bg-slate-100 content-center justify-center rounded-sm',
              )}
            >
              {minimapFeature ? (
                <Suspense fallback={<div>Loading...</div>}>
                  {/* @ts-ignore */}
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {page ? 'Update Event' : 'Create Event'}
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
