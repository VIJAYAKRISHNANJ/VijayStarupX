import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`glass-card p-6 ${glow ? 'red-glow' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
