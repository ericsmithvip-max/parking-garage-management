import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', fullWidth, ...props }, ref) => {
    const baseStyles = 'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
    const widthStyles = fullWidth ? 'w-full' : ''

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${widthStyles} ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
