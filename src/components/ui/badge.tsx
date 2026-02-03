import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'muted' | 'outline'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium',
          {
            'bg-[rgb(var(--fg))]/10 text-[rgb(var(--fg-muted))]': variant === 'default',
            'bg-[rgb(var(--fg))]/5 text-[rgb(var(--fg-subtle))]': variant === 'muted',
            'border border-[rgb(var(--border))] text-[rgb(var(--fg-muted))]': variant === 'outline',
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
