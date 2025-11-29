import * as React from 'react'

import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onFocus, onBlur, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)
    const fallbackValueRef = React.useRef('')

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      const input = innerRef.current

      if (type === 'number' && input) {
        fallbackValueRef.current = input.value ?? ''
        input.value = ''
      }

      onFocus?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const input = innerRef.current

      if (type === 'number' && input) {
        if (input.value === '') {
          input.value = fallbackValueRef.current
        } else {
          fallbackValueRef.current = input.value
        }
      }

      onBlur?.(event)
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={(node) => {
          innerRef.current = node

          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
