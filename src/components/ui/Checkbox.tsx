import * as React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onChange, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate)
      }
    }, [indeterminate])

    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          type="checkbox"
          ref={inputRef}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <div
          onClick={(e) => {
            if (!disabled && inputRef.current) {
              e.preventDefault()
              inputRef.current.click()
            }
          }}
          className={cn(
            'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center',
            checked || indeterminate
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-muted-foreground/40 hover:border-primary',
            disabled && 'cursor-not-allowed opacity-50 bg-muted border-muted',
            className
          )}
          aria-hidden="true"
        >
          {indeterminate ? (
            <Minus className="h-3 w-3 stroke-[3]" />
          ) : checked ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : null}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
