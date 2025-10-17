'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
import { Input } from '../ui/input'

import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMap } from '@vis.gl/react-maplibre'
import { Slider } from '../ui/slider'
import { m } from 'framer-motion'
import { Form } from '../ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || ''

const schema = z.object({
  point: z.array(z.number()),
  distance: z
    .number()
    .min(20, 'Distance must be at least 20 kilometers')
    .max(500, 'Distance cannot exceed 500 kilometers'),
})

type EventSearchFields = z.infer<typeof schema>

export function LocationIQSearch({
  markerRef,
  setPoint,
  point,
  setDistance,
  distance,
}: {
  markerRef: RefObject<maplibregl.Marker | null>
  setPoint: (point: number[] | null) => void
  point: number[] | null
  setDistance: (distance: number) => void
  distance: number
}) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  const [openLocation, setOpenLocation] = useState(false)
  const [valueLocation, setValueLocation] = useState('')

  const [openDistance, setOpenDistance] = useState(false)

  const { current: map } = useMap()

  useEffect(() => {
    const a = 5 * Math.exp(-0.00693 * distance) + 3
    map?.zoomTo(a)
    console.log('a', a)
  }, [distance])

  useEffect(() => {
    if (search.length < 3) {
      setResults([])
      return
    }

    const fetchAutocomplete = async () => {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${search}&limit=5`,
      )
      const data = await response.json()
      setResults(data)
    }

    const debounce = setTimeout(fetchAutocomplete, 500)
    return () => clearTimeout(debounce)
  }, [search])

  const form = useForm<EventSearchFields>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      point: point || [],
      distance: distance,
    },
  })

  const onSubmit: SubmitHandler<EventSearchFields> = async (data) => {
    try {
      alert('aa')
      console.log(data)
    } catch (error) {
      console.error('Login error', error)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="z-50 absolute w-full top-0 left-0 right-0 p-4">
          <div className="flex gap-2">
            <div className="w-full max-w-full ">
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLocation}
                    className="max-w-full w-full justify-between truncate"
                  >
                    {valueLocation ? valueLocation : 'Where ?...'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Where ?..."
                      className="h-9"
                      onValueChange={(value) => setSearch(value)}
                    />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {results[0] &&
                          results.map((result: any & { lon: number; lat: number }) => (
                            <CommandItem
                              key={result.place_id}
                              value={result.display_name}
                              onSelect={(currentValue) => {
                                setValueLocation(currentValue === valueLocation ? '' : currentValue)
                                setOpenLocation(false)
                                if (map) {
                                  map.flyTo({
                                    center: [result.lon, result.lat],
                                  })
                                  setPoint([result.lon, result.lat])
                                  form.setValue('point', [Number(result.lon), Number(result.lat)])

                                  if (markerRef?.current) {
                                    markerRef.current.setLngLat([result.lon, result.lat])
                                  }
                                }
                              }}
                            >
                              {result.display_name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  valueLocation === result.display_name
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-24">
              <Popover open={openDistance} onOpenChange={setOpenDistance}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDistance}
                    className="w-full justify-between"
                  >
                    {distance + ' km'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <div className="p-2 flex">
                      <Slider
                        min={20}
                        defaultValue={[20]}
                        max={500}
                        step={10}
                        onValueChange={(v) => {
                          form.setValue('distance', distance)
                          setDistance(v[0])
                        }}
                      />
                      <div className="text-right w-20 text-sm">{distance} km</div>
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">
              <Search />
            </Button>
          </div>
        </div>{' '}
      </form>
    </Form>
  )
}
