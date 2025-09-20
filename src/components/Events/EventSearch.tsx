'use client'

import { Input } from '../ui/input'
import { Layer, Map, Marker, Source } from '@vis.gl/react-maplibre'
import { LocationIQSearch } from './LocationIQSearch'

import 'maplibre-gl/dist/maplibre-gl.css'

import { useState, useEffect, useRef } from 'react'

import * as turf from '@turf/turf'

import { Feature, GeoJsonProperties, Polygon } from 'geojson'

const fillLayer = {
  id: 'circle-fill',
  type: 'fill',
  paint: {
    'fill-color': '#007cbf', // Blaue Füllung
    'fill-opacity': 0.3, // Transparenz
  },
}

const lineLayer = {
  type: 'line',
  paint: {
    'line-color': '#007cbf',
    'line-width': 2,
  },
}

export function EventSearch({ className, ...props }: React.ComponentProps<'div'>) {
  const markerRef = useRef<maplibregl.Marker>(null)
  const [point, setPoint] = useState<number[] | null>(null)
  const [distance, setDistance] = useState<number>(20)
  const [circleGeoJSON, setCircleGeoJSON] = useState<Feature<Polygon, GeoJsonProperties> | null>(
    null,
  )

  const generateCircle = (center: number[], radius: number) => {
    if (!center) return
    const circle = turf.circle([center[0], center[1]], radius, {
      steps: 64,
      units: 'kilometers',
    })
    setCircleGeoJSON(circle)
  }

  useEffect(() => {
    if (!point) return
    generateCircle(point, distance)
  }, [point, distance])

  return (
    <>
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ width: 600, height: 400, zIndex: 1 }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        <LocationIQSearch
          markerRef={markerRef}
          setPoint={setPoint}
          setDistance={setDistance}
          distance={distance}
          point={point}
        />

        {circleGeoJSON && (
          <Source id="circle-source" type="geojson" data={circleGeoJSON}>
            <Layer {...fillLayer} type="fill" />
            <Layer {...lineLayer} type="line" />
          </Source>
        )}
        <Marker
          longitude={-100}
          latitude={40}
          anchor="bottom"
          ref={markerRef}
          className="mt-6"
        ></Marker>
      </Map>
    </>
  )
}
