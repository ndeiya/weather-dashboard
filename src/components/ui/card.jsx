import React from 'react'

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl shadow bg-white dark:bg-gray-900 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-800 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h2 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`px-4 py-2 ${className}`} {...props}>
      {children}
    </div>
  )
} 