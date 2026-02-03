import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          'rounded-2xl transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'active:scale-[0.98]',
          {
            // Variants
            'bg-[rgb(var(--accent))] text-white shadow-lg shadow-[rgb(var(--accent))]/20 hover:shadow-xl hover:shadow-[rgb(var(--accent))]/30': variant === 'primary',
            'bg-[rgb(var(--surface-raised))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]': variant === 'secondary',
            'bg-transparent text-[rgb(var(--fg-muted))] hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--fg))]': variant === 'ghost',
            'bg-[rgb(var(--error))]/10 text-[rgb(var(--error))] hover:bg-[rgb(var(--error))]/20': variant === 'danger',
            // Sizes
            'text-sm px-4 py-2': size === 'sm',
            'text-sm px-6 py-3': size === 'md',
            'text-base px-8 py-4': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
