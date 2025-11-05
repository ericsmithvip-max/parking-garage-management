import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, name, error, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
