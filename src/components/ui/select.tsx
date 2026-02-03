import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 appearance-none',
            'bg-[rgb(var(--muted))] border border-[rgb(var(--border))]',
            'rounded-lg text-[rgb(var(--fg))]',
            'transition-colors duration-150',
            'focus:border-[rgb(var(--ring))] focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'pr-10',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--muted-fg))] pointer-events-none" 
        />
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
