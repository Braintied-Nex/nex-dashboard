import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full px-3 py-2',
          'bg-[rgb(var(--muted))] border border-[rgb(var(--border))]',
          'rounded-[--radius-lg] text-[rgb(var(--fg))]',
          'placeholder:text-[rgb(var(--muted-fg))]',
          'transition-colors duration-[--duration-fast]',
          'focus:border-[rgb(var(--ring))] focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
