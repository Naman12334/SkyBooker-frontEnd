import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  }
  
  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-8 py-2.5 text-sm',
    lg: 'px-10 py-3.5 text-base',
    icon: 'p-3 rounded-full'
  }

  return (
    <button
      className={cn(
        'rounded-full font-bold tracking-widest transition-all duration-300 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export default Button
