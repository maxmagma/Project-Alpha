'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Settings,
  Palette,
  ShoppingBag,
} from 'lucide-react'

interface SidebarNavProps {
  role: 'vendor' | 'admin'
}

const vendorItems = [
  {
    title: 'Dashboard',
    href: '/vendor/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/vendor/products',
    icon: Package,
  },
  {
    title: 'Inquiries',
    href: '/vendor/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/vendor/settings',
    icon: Settings,
  },
]

const adminItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Vendors',
    href: '/admin/vendors',
    icon: Users,
  },
  {
    title: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Style Presets',
    href: '/admin/presets',
    icon: Palette,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
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
