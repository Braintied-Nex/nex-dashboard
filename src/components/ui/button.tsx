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
          'rounded-xl transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--fg)/0.3)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]',
          'disabled:opacity-50 disabled:pointer-events-none',
          'active:scale-[0.98]',
          {
            // Variants
            'bg-[rgb(var(--fg))] text-[rgb(var(--bg))] hover:opacity-90': variant === 'primary',
            'glass-inset text-1 hover:bg-[rgb(var(--glass-inset-hover))]': variant === 'secondary',
            'bg-transparent text-3 hover:bg-[rgb(var(--glass-inset))] hover:text-1': variant === 'ghost',
            'bg-red-500/15 text-red-400 hover:bg-red-500/25': variant === 'danger',
            // Sizes
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-5 py-2.5': size === 'md',
            'text-sm px-6 py-3': size === 'lg',
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
