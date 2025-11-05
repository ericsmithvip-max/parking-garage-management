import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white'
    const widthStyles = fullWidth ? 'w-full' : ''

    return (
      <select
        ref={ref}
        className={`${baseStyles} ${widthStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
