import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.5,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(value * eased)
      setDisplay(start)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value, duration])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tabular-nums"
    >
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </motion.span>
  )
}
