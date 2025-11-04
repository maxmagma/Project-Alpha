import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-white',
        outline: 'bg-white text-black',
        secondary: 'bg-gray-100 text-black border-black',
        // All variants are black/white only - no colors
        success: 'bg-black text-white',
        warning: 'bg-white text-black border-2',
        danger: 'bg-black text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
