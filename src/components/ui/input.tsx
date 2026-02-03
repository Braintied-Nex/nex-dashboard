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
          'w-full px-4 py-3 rounded-2xl text-sm',
          'bg-[rgb(var(--surface))] text-[rgb(var(--fg))]',
          'border border-[rgb(var(--border))]',
          'placeholder:text-[rgb(var(--fg-muted))]',
          'focus:outline-none focus:border-[rgb(var(--accent))] focus:ring-1 focus:ring-[rgb(var(--accent))]',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
