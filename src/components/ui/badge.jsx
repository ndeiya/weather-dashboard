import React from 'react'

export function Badge({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    secondary: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${variants[variant] || ''} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
} 