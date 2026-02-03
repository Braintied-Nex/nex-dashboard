import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-[--duration-fast]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'text-sm px-3 py-1.5 rounded-[--radius-md]': size === 'sm',
            'text-sm px-4 py-2 rounded-[--radius-lg]': size === 'md',
            'text-base px-6 py-3 rounded-[--radius-lg]': size === 'lg',
          },
          
          // Color variants
          {
            'bg-[rgb(var(--accent))] text-[rgb(var(--accent-fg))] hover:brightness-110': variant === 'primary',
            'bg-[rgb(var(--muted))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]': variant === 'secondary',
            'bg-transparent text-[rgb(var(--muted-fg))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]': variant === 'ghost',
            'bg-[rgb(var(--error)/0.15)] text-[rgb(var(--error))] hover:bg-[rgb(var(--error)/0.25)]': variant === 'danger',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
