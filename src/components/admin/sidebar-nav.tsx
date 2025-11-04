'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  Squares2X2Icon,
  CubeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'

interface SidebarNavProps {
  role: 'vendor' | 'admin'
}

const vendorItems = [
  {
    title: 'Dashboard',
    href: '/vendor/dashboard',
    icon: Squares2X2Icon,
  },
  {
    title: 'Products',
    href: '/vendor/products',
    icon: CubeIcon,
  },
  {
    title: 'Inquiries',
    href: '/vendor/inquiries',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Settings',
    href: '/vendor/settings',
    icon: Cog6ToothIcon,
  },
]

const adminItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Squares2X2Icon,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: CubeIcon,
  },
  {
    title: 'Vendors',
    href: '/admin/vendors',
    icon: UsersIcon,
  },
  {
    title: 'Inquiries',
    href: '/admin/inquiries',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Style Presets',
    href: '/admin/presets',
    icon: PaintBrushIcon,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBagIcon,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
  },
]

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname()
  const items = role === 'vendor' ? vendorItems : adminItems

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
