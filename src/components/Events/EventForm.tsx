'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Event, Page } from '@/payload-types'
import { Label } from '../ui/label'
import { createPage, deletePage, updatePage } from '../Pages/actions/pages'
import { useState, useEffect, useRef } from 'react'

import { Checkbox } from '../ui/checkbox'
import { Calendar } from '../ui/calendar'
import { DateRange } from 'react-day-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { AddressForm } from './AdressForm'
import { createEvent, updateEvent } from './actions/events'
import { useRouter } from 'next/navigation'

const schema = z
  .object({
    eventName: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name cannot exceed 30 characters'),
    description: z
      .string()
      .min(3, 'Description must be at least 3 characters')
      .max(255, 'description cannot exceed 255 characters')
      .optional()
      .or(z.literal('')),
    eventType: z
      .array(z.enum(['localEvent', 'onlineEvent']))
      .min(1, 'Select at least one event type')
      .default([]),
    addressName: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    addressBox: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    zipCode: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),

    coordinates: z.union([z.tuple([z.number(), z.number()]), z.null(), z.undefined()]),

    startDate: z.date({
      required_error: 'Start date is required',
    }),
    endDate: z.date({
      required_error: 'End date is required',
    }),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.eventType.includes('localEvent')) {
        return !!data.coordinates
      }
      return true
    },
    {
      message: 'Provide a location for the event',
      path: ['addressBox'], // path of error
    },
  )
// .refine((data) => data.eventType.includes('localEvent') && !(!data.long || !data.lat), {
//   message: 'Provide a location for the event',
//   path: ['addressBox'], // path of error
// })

export type EventFormFields = z.infer<typeof schema>

export function EventForm({
  event,
  className,
  ...props
}: React.ComponentProps<'div'> & { event?: Event }) {
  const router = useRouter()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: event?.startDate ? new Date(event.startDate) : undefined,
    to: event?.endDate ? new Date(event.endDate) : undefined,
  })

  const form = useForm<EventFormFields>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      eventName: event?.eventName || '',
      description: event?.description || '',
      startTime: event?.startDate
        ? new Date(event.startDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : '00:00',
      endTime: event?.endDate
        ? new Date(event.endDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : '00:00',
      eventType: event?.eventType || [],
      addressName: event?.addressName || '',
      addressBox: event?.addressName || '',
      address: event?.address || '',
      city: event?.city || '',
      state: event?.state || '',
      zipCode: event?.zipCode || '',
      country: event?.country || '',

      coordinates: event?.coordinates || [],
    },
  })

  // Function to combine date and time
  const combineDateAndTime = (date: Date, timeString: string) => {
    if (!date || !timeString) return date

    const [hours, minutes] = timeString.split(':').map(Number)
    const dateTime = new Date(date)
    dateTime.setHours(hours, minutes, 0)
    return dateTime
  }

  // Watch for time input changes
  const watchStartTime = form.watch('startTime')
  const watchEndTime = form.watch('endTime')
  const watchLocalEventType = form.watch('eventType').includes('localEvent')

  useEffect(() => {
    if (dateRange?.from) {
      const startTimeValue = watchStartTime || '10:30:00'
      form.setValue('startDate', combineDateAndTime(dateRange.from, startTimeValue))
    }

    if (dateRange?.to) {
      const endTimeValue = watchEndTime || '12:30:00'
      form.setValue('endDate', combineDateAndTime(dateRange.to, endTimeValue))
    }
  }, [dateRange, watchStartTime, watchEndTime, form])

  const onSubmit: SubmitHandler<EventFormFields> = async (data) => {
    try {
      const result = event
        ? await updateEvent({
            ...event,
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
          })
        : await createEvent({
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
          })

      if (result.success) {
        router.push(`/event/${result.event?.id}`)
      } else {
        form.setError('eventName', { message: result.error })
      }
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Whats the name of your event?"
                    {...field}
                    className="w-full"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Whats is your event about?"
                    {...field}
                    className="w-full"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>

                <div className="flex gap-4 items-center place-self-center">
                  <FormControl>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range)
                      }}
                      className="rounded-lg border shadow-sm"
                    />
                  </FormControl>
                  {/* Start Time Picker */}
                  <div>
                    <FormLabel className="mt-4">Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" step="60" {...form.register('startTime')} />
                    </FormControl>
                    {/* End Time Picker */}
                    <FormLabel className="mt-4">End Time</FormLabel>
                    <FormControl>
                      <Input type="time" step="60" {...form.register('endTime')} />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventType"
            render={() => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => {
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormControl>
                            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                              <Checkbox
                                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                checked={field.value?.includes('onlineEvent')}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, 'onlineEvent'])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== 'onlineEvent'),
                                      )
                                }}
                              />
                              <div className="grid gap-1.5 font-normal">
                                <p className="text-sm leading-none font-medium">Online Event</p>
                                <p className="text-muted-foreground text-sm">
                                  You can enable or disable notifications at any time.
                                </p>
                              </div>
                            </Label>
                          </FormControl>
                        </FormItem>

                        <FormItem>
                          <FormControl>
                            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                              <Checkbox
                                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                checked={field.value?.includes('localEvent')}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, 'localEvent'])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== 'localEvent'),
                                      )
                                }}
                              />
                              <div className="grid gap-1.5 font-normal">
                                <p className="text-sm leading-none font-medium">Local Event</p>
                                <p className="text-muted-foreground text-sm">
                                  You can enable or disable notifications at any time.
                                </p>
                              </div>
                            </Label>
                          </FormControl>
                        </FormItem>
                      </div>
                    )
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {watchLocalEventType && <AddressForm form={form} />}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </Form>
    </>
  )
}
