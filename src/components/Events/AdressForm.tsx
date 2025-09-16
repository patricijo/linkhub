'use client'

import { Input } from '../ui/input'

import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useState, useEffect, useRef } from 'react'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { EventFormFields } from './EventForm'
import { UseFormReturn } from 'react-hook-form'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export function AddressForm({
  form,
  className,
  ...props
}: React.ComponentProps<'div'> & { form: UseFormReturn<EventFormFields> }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  const [inputValue, setInputValue] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const handleDragEnd = (event: any) => {
      if (markerRef.current) {
        const lngLat = markerRef.current.getLngLat()
        form.setValue('coordinates', [lngLat.lng, lngLat.lat])
      }
    }

    mapboxgl.accessToken = accessToken

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: (form.watch('coordinates')?.[0] && form.watch('coordinates')) || [0, 0],
      zoom: 9,
    })

    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat((form.watch('coordinates')?.[0] && form.watch('coordinates')) || [0, 0])
      .addTo(mapInstanceRef.current)

    markerRef.current.on('dragend', handleDragEnd)

    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true)
    })
  }, [])

  const handleChange = (d: any) => {
    console.log('d', d)
    if (d?.features?.[0]?.geometry?.coordinates) {
      const [lng, lat] = d.features[0].geometry.coordinates
      if (markerRef.current && mapInstanceRef.current) {
        markerRef.current.setLngLat([lng, lat])
        mapInstanceRef.current.setCenter([lng, lat])
      }
    }

    form.setValue('addressName', d.features[0].properties.name || '')
    form.setValue('address', d.features[0].properties.address || '')
    form.setValue('city', d.features[0].properties.context?.place?.name || '')
    form.setValue('state', d.features[0].properties.context?.region?.name || '')
    form.setValue('zipCode', d.features[0].properties.context?.postcode?.name || '')
    form.setValue('country', d.features[0].properties.context?.country?.name || '')
    form.setValue('coordinates', d.features[0].geometry.coordinates || [0, 0])
  }

  return (
    <>
      <FormField
        control={form.control}
        name="addressBox"
        render={() => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <div className="relative rounded-md overflow-hidden">
              <div className="p-4 absolute z-[900] w-full right-0 left-0">
                <FormControl>
                  {/* @ts-expect-error */}
                  <SearchBox
                    accessToken={accessToken}
                    map={mapInstanceRef.current || undefined}
                    mapboxgl={mapboxgl}
                    value={inputValue}
                    onRetrieve={(d) => {
                      handleChange(d)
                    }}
                  />
                </FormControl>
              </div>

              <div id="map-container" ref={mapContainerRef} className="h-[300px] z-10" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="addressName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name, apartment, suite, etc. (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
