import { motion } from 'framer-motion'

const messages = [
  'Analyzing business fundamentals...',
  'Evaluating market opportunity...',
  'Computing growth and revenue metrics...',
  'Assessing team and competition strength...',
  'Synthesizing investor-grade insights...',
]

export function ProcessingAnimation() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="relative mb-10">
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
      </div>

      <h2 className="text-2xl font-heading font-bold mb-2">Analysis in Progress</h2>
      <p className="text-muted text-sm mb-8">
        Running valuation engine and narrative insight generation
      </p>

      <div className="space-y-3 w-full max-w-sm">
        {messages.map((msg, i) => (
          <motion.div
            key={msg}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.55, duration: 0.4 }}
            className="flex items-center gap-3 text-sm"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
            />
            <span className="text-muted">{msg}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-sm h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: '2%' }}
          animate={{
            width: ['3%', '55%', '82%', '95%'],
          }}
          transition={{
            duration: 15,
            times: [0, 0.08, 0.5, 1],
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  )
}
