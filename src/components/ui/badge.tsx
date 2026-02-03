import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'accent'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
          'transition-colors duration-150',
          {
            'bg-[rgb(var(--surface-raised))] text-[rgb(var(--fg-muted))]': variant === 'default',
            'bg-[rgb(var(--border))] text-[rgb(var(--fg-muted))]': variant === 'secondary',
            'bg-[rgb(var(--success))]/15 text-[rgb(var(--success))]': variant === 'success',
            'bg-[rgb(var(--warning))]/15 text-[rgb(var(--warning))]': variant === 'warning',
            'bg-[rgb(var(--error))]/15 text-[rgb(var(--error))]': variant === 'error',
            'bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))]': variant === 'accent',
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
