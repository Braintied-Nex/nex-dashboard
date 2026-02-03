import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 min-h-[80px]',
          'bg-[rgb(var(--muted))] border border-[rgb(var(--border))]',
          'rounded-lg text-[rgb(var(--fg))]',
          'placeholder:text-[rgb(var(--muted-fg))]',
          'transition-colors duration-150',
          'focus:border-[rgb(var(--ring))] focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'resize-none',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
