'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Page } from '@/payload-types'
import { Label } from '../ui/label'
import { createPage, deletePage, updatePage } from '../Pages/actions/pages'
import { useState, useEffect, useRef } from 'react'

import { Checkbox } from '../ui/checkbox'
import { Calendar } from '../ui/calendar'
import { DateRange } from 'react-day-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { AddressForm } from './AdressForm'

const schema = z.object({
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
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  lat: z.number().optional(),
  long: z.number().optional(),

  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type EventFormFields = z.infer<typeof schema>

export function EventForm({
  page,
  className,
  ...props
}: React.ComponentProps<'div'> & { page?: Page }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const form = useForm<EventFormFields>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      startTime: '09:00',
      endTime: '17:00',
      eventType: [],
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      lat: 0,
      long: 0,
    },
  })

  // Function to combine date and time
  const combineDateAndTime = (date: Date | undefined, timeString: string | undefined) => {
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
            {page ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </Form>
    </>
  )
}
