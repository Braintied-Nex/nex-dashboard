import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'muted' | 'outline' | 'success' | 'warning' | 'error' | 'info'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium',
          {
            'bg-[rgb(var(--fg))]/10 text-2': variant === 'default',
            'glass-inset text-3': variant === 'secondary',
            'bg-[rgb(var(--glass-inset))] text-4': variant === 'muted',
            'border border-[rgb(var(--glass-border))] text-3': variant === 'outline',
            'bg-green-500/15 text-green-400': variant === 'success',
            'bg-amber-500/15 text-amber-400': variant === 'warning',
            'bg-red-500/15 text-red-400': variant === 'error',
            'bg-blue-500/15 text-blue-400': variant === 'info',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
