import { motion } from 'framer-motion'

const steps = [
  {
    step: '01',
    title: 'Fill the Questionnaire',
    description:
      'Complete a comprehensive 10-section form covering company basics, team, financials, growth, and market data.',
  },
  {
    step: '02',
    title: 'AI Processing',
    description:
      'Our valuation engine analyzes 50+ data points across industry benchmarks, growth metrics, and competitive factors.',
  },
  {
    step: '03',
    title: 'Get Your Report',
    description:
      'Receive estimated valuation, health scores, funding stage prediction, and investor-ready insights in minutes.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted">Three steps to your investor-grade valuation report.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center red-glow">
                <span className="font-heading font-bold text-primary text-lg">
                  {item.step}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
