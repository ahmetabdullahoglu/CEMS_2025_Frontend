import * as React from 'react'

import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onCheckedChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
