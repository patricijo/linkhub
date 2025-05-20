'use client'

import { ArrowDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import LogoutButton from './Auth/LogoutButton'

import { useUser } from './Auth/Provider'
import { Button } from './ui/button'
import Link from 'next/link'

export function Navbar() {
  const { user } = useUser()

  return (
    <>
      <div className="absolute left-6 top-6 text-2xl text-gray-700 font-semibold">
        <Link href={'/'}>LinkHub</Link>
      </div>
      <div className="absolute right-6 top-6">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className=" content-center" asChild>
              <Button className="w-56">
                <span className="truncate text-xs">{user.email}</span>
                <ArrowDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={'/dashboard'} className=" cursor-pointer">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={'/signin'}>
            <Button>Log In</Button>{' '}
          </Link>
        )}
      </div>
    </>
  )
}
