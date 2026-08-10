import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 sm:p-14 text-center red-glow relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Ready to Discover Your Valuation?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Join thousands of founders who use VijayX StartupWin to understand
              their market worth and prepare for investor conversations.
            </p>
            <Link to="/predict">
              <Button size="lg">Start Free Valuation →</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
