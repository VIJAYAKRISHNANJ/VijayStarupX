import { motion } from 'framer-motion'
import { Card } from '../ui/Card'

const features = [
  {
    title: 'AI Valuation Predictor',
    description:
      'Multi-factor analysis across revenue, growth, team, market, and technology to estimate your startup valuation.',
    icon: '🎯',
  },
  {
    title: 'Startup Health Score',
    description:
      '0–100 score broken into Team, Market, Revenue, Product, Traction, Competition, and Scalability.',
    icon: '💚',
  },
  {
    title: 'Investor-Grade Report',
    description:
      'Strengths, weaknesses, opportunities, risks, and funding stage recommendations in one dashboard.',
    icon: '📊',
  },
  {
    title: 'Valuation Breakdown',
    description:
      'See exactly how each category contributes to your estimated valuation with interactive charts.',
    icon: '📈',
  },
  {
    title: 'Funding Stage Prediction',
    description:
      'From Bootstrapped to Series C+, understand where you stand in the funding lifecycle.',
    icon: '🚀',
  },
  {
    title: 'Actionable Insights',
    description:
      'Personalized recommendations to improve recurring revenue, retention, TAM, and investor readiness.',
    icon: '💡',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Everything You Need to <span className="text-primary">Win Investors</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            A premium AI platform built for founders, angel investors, and venture
            capital firms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-primary/30 transition-colors group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
