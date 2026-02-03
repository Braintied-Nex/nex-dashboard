import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function Badge({ 
  className, 
  variant = 'default', 
  children,
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[--radius-md]',
        {
          'bg-[rgb(var(--muted))] text-[rgb(var(--muted-fg))]': variant === 'default',
          'bg-[rgb(var(--success)/0.15)] text-[rgb(var(--success))]': variant === 'success',
          'bg-[rgb(var(--warning)/0.15)] text-[rgb(var(--warning))]': variant === 'warning',
          'bg-[rgb(var(--error)/0.15)] text-[rgb(var(--error))]': variant === 'error',
          'bg-[rgb(var(--info)/0.15)] text-[rgb(var(--info))]': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
