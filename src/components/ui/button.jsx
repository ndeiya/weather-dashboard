import React from 'react'

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'
  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 focus:ring-blue-500',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  }
  const sizes = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button
      className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
} 