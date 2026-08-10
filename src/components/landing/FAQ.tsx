import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'How accurate is the valuation prediction?',
    a: 'Our rule-based engine uses industry multiples, growth metrics, and 50+ data points. Confidence scores reflect input completeness. Results are directional estimates, not formal appraisals.',
  },
  {
    q: 'What industries are supported?',
    a: 'SaaS, FinTech, EdTech, AI, Healthcare, E-Commerce, Logistics, Gaming, and more with industry-specific valuation multiples.',
  },
  {
    q: 'How long does the process take?',
    a: 'Most users complete the questionnaire in under 5 minutes. AI processing takes about 3 seconds before results appear.',
  },
  {
    q: 'Is my startup data stored?',
    a: 'In this MVP, data stays in your browser session. Full version will include secure authentication and encrypted PostgreSQL storage.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-card/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="glass-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/2 transition-colors"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <span className="text-primary text-xl shrink-0">
                  {open === i ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-6 pb-4 text-sm text-muted leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
