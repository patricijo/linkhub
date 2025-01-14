'use client'
import { Page } from '@/payload-types'
import { usePages } from './Provider'
import { useEffect } from 'react'

export function ActivePage({ page }: { page: Page }) {
  const { setActivePage } = usePages()

  useEffect(() => {
    setActivePage(page)
  }, [])

  return null
}
