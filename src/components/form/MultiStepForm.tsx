import { motion } from 'framer-motion'
import type { StartupFormData } from '../../types/startup'
import {
  InputField,
  SelectField,
  TextAreaField,
  ToggleField,
} from '../ui/FormFields'

const INDUSTRIES = [
  'SaaS',
  'FinTech',
  'EdTech',
  'AI',
  'Healthcare',
  'E-Commerce',
  'Logistics',
  'Gaming',
].map((v) => ({ value: v, label: v }))

const BUSINESS_MODELS = [
  'Subscription',
  'Marketplace',
  'Freemium',
  'Transaction Fee',
  'Advertising',
  'Enterprise License',
  'Hardware + Software',
].map((v) => ({ value: v, label: v }))

const PRODUCT_STAGES = [
  'Idea',
  'MVP',
  'Beta',
  'Live Product',
  'Scaling',
].map((v) => ({ value: v, label: v }))

const FUNDING_STAGES = [
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
].map((v) => ({ value: v, label: v }))

export const FORM_STEPS = [
  'Company Basics',
  'Team',
  'Financials',
  'Growth',
  'Product',
  'Customers',
  'Funding',
  'Market',
  'Competition',
  'Technology',
]

interface StepContentProps {
  step: number
  data: StartupFormData
  onChange: (updates: Partial<StartupFormData>) => void
}

function num(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : n
}

export function StepContent({ step, data, onChange }: StepContentProps) {
  switch (step) {
    case 0:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Startup Name"
            value={data.startupName}
            onChange={(e) => onChange({ startupName: e.target.value })}
            placeholder="Acme Technologies"
            required
          />
          <InputField
            label="Founder Name"
            value={data.founderName}
            onChange={(e) => onChange({ founderName: e.target.value })}
            placeholder="Jane Doe"
            required
          />
          <InputField
            label="Country"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="India"
          />
          <InputField
            label="Founded Year"
            type="number"
            value={data.foundedYear}
            onChange={(e) => onChange({ foundedYear: num(e.target.value) })}
            min={1990}
            max={new Date().getFullYear()}
          />
          <SelectField
            label="Industry"
            options={INDUSTRIES}
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
          />
          <SelectField
            label="Business Model"
            options={BUSINESS_MODELS}
            value={data.businessModel}
            onChange={(e) => onChange({ businessModel: e.target.value })}
          />
        </div>
      )

    case 1:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Number of Founders"
            type="number"
            value={data.numberOfFounders}
            onChange={(e) => onChange({ numberOfFounders: num(e.target.value) })}
            min={1}
          />
          <InputField
            label="Team Size"
            type="number"
            value={data.teamSize}
            onChange={(e) => onChange({ teamSize: num(e.target.value) })}
            min={1}
          />
          <InputField
            label="Technical Founders"
            type="number"
            value={data.technicalFounders}
            onChange={(e) => onChange({ technicalFounders: num(e.target.value) })}
            min={0}
          />
          <div className="sm:col-span-2 space-y-4 pt-2">
            <ToggleField
              label="Previous Startup Experience"
              checked={data.previousStartupExperience}
              onChange={(v) => onChange({ previousStartupExperience: v })}
            />
            <ToggleField
              label="Advisor Availability"
              checked={data.advisorAvailability}
              onChange={(v) => onChange({ advisorAvailability: v })}
            />
          </div>
        </div>
      )

    case 2:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Annual Revenue (₹)"
            type="number"
            value={data.annualRevenue || ''}
            onChange={(e) => onChange({ annualRevenue: num(e.target.value) })}
            placeholder="10000000"
            hint="Total annual revenue in INR"
          />
          <InputField
            label="Monthly Revenue (₹)"
            type="number"
            value={data.monthlyRevenue || ''}
            onChange={(e) => onChange({ monthlyRevenue: num(e.target.value) })}
            placeholder="833333"
          />
          <InputField
            label="Monthly Burn Rate (₹)"
            type="number"
            value={data.monthlyBurnRate || ''}
            onChange={(e) => onChange({ monthlyBurnRate: num(e.target.value) })}
            placeholder="500000"
          />
          <InputField
            label="Profit Margin (%)"
            type="number"
            value={data.profitMargin || ''}
            onChange={(e) => onChange({ profitMargin: num(e.target.value) })}
            min={-100}
            max={100}
          />
          <InputField
            label="Gross Margin (%)"
            type="number"
            value={data.grossMargin || ''}
            onChange={(e) => onChange({ grossMargin: num(e.target.value) })}
            min={0}
            max={100}
          />
        </div>
      )

    case 3:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Monthly Growth (%)"
            type="number"
            value={data.monthlyGrowthPercent || ''}
            onChange={(e) => onChange({ monthlyGrowthPercent: num(e.target.value) })}
            placeholder="8"
          />
          <InputField
            label="Annual Growth (%)"
            type="number"
            value={data.annualGrowthPercent || ''}
            onChange={(e) => onChange({ annualGrowthPercent: num(e.target.value) })}
            placeholder="120"
          />
          <InputField
            label="Customer Growth (%)"
            type="number"
            value={data.customerGrowth || ''}
            onChange={(e) => onChange({ customerGrowth: num(e.target.value) })}
          />
          <InputField
            label="Revenue Growth (%)"
            type="number"
            value={data.revenueGrowth || ''}
            onChange={(e) => onChange({ revenueGrowth: num(e.target.value) })}
          />
        </div>
      )

    case 4:
      return (
        <div className="max-w-md">
          <SelectField
            label="Product Stage"
            options={PRODUCT_STAGES}
            value={data.productStage}
            onChange={(e) =>
              onChange({
                productStage: e.target.value as StartupFormData['productStage'],
              })
            }
          />
          <p className="text-sm text-muted mt-4">
            Select the current maturity of your product. Later stages significantly
            impact valuation multiples.
          </p>
        </div>
      )

    case 5:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Total Customers"
            type="number"
            value={data.totalCustomers || ''}
            onChange={(e) => onChange({ totalCustomers: num(e.target.value) })}
          />
          <InputField
            label="Paying Customers"
            type="number"
            value={data.payingCustomers || ''}
            onChange={(e) => onChange({ payingCustomers: num(e.target.value) })}
          />
          <InputField
            label="Active Users"
            type="number"
            value={data.activeUsers || ''}
            onChange={(e) => onChange({ activeUsers: num(e.target.value) })}
          />
          <InputField
            label="Retention Rate (%)"
            type="number"
            value={data.retentionRate || ''}
            onChange={(e) => onChange({ retentionRate: num(e.target.value) })}
            min={0}
            max={100}
          />
          <InputField
            label="Churn Rate (%)"
            type="number"
            value={data.churnRate || ''}
            onChange={(e) => onChange({ churnRate: num(e.target.value) })}
            min={0}
            max={100}
          />
        </div>
      )

    case 6:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Total Funding Raised (₹)"
            type="number"
            value={data.totalFunding || ''}
            onChange={(e) => onChange({ totalFunding: num(e.target.value) })}
          />
          <SelectField
            label="Current Funding Stage"
            options={FUNDING_STAGES}
            value={data.fundingStage}
            onChange={(e) =>
              onChange({
                fundingStage: e.target.value as StartupFormData['fundingStage'],
              })
            }
          />
          <InputField
            label="Number of Investors"
            type="number"
            value={data.investors || ''}
            onChange={(e) => onChange({ investors: num(e.target.value) })}
          />
          <InputField
            label="Grants Received (₹)"
            type="number"
            value={data.grants || ''}
            onChange={(e) => onChange({ grants: num(e.target.value) })}
          />
        </div>
      )

    case 7:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="TAM — Total Addressable Market (₹)"
            type="number"
            value={data.tam || ''}
            onChange={(e) => onChange({ tam: num(e.target.value) })}
            hint="Total market size in INR"
          />
          <InputField
            label="SAM — Serviceable Addressable Market (₹)"
            type="number"
            value={data.sam || ''}
            onChange={(e) => onChange({ sam: num(e.target.value) })}
          />
          <InputField
            label="SOM — Serviceable Obtainable Market (₹)"
            type="number"
            value={data.som || ''}
            onChange={(e) => onChange({ som: num(e.target.value) })}
          />
        </div>
      )

    case 8:
      return (
        <div className="grid grid-cols-1 gap-5">
          <InputField
            label="Number of Competitors"
            type="number"
            value={data.numberOfCompetitors}
            onChange={(e) => onChange({ numberOfCompetitors: num(e.target.value) })}
            min={0}
          />
          <TextAreaField
            label="Competitive Advantage"
            value={data.competitiveAdvantage}
            onChange={(e) => onChange({ competitiveAdvantage: e.target.value })}
            placeholder="Describe your key competitive moats..."
          />
          <TextAreaField
            label="Market Differentiation"
            value={data.marketDifferentiation}
            onChange={(e) => onChange({ marketDifferentiation: e.target.value })}
            placeholder="How do you stand out from competitors?"
          />
          <ToggleField
            label="Patent / IP Protection"
            checked={data.patentIp}
            onChange={(v) => onChange({ patentIp: v })}
          />
        </div>
      )

    case 9:
      return (
        <div className="grid grid-cols-1 gap-5">
          <InputField
            label="Tech Stack"
            value={data.techStack}
            onChange={(e) => onChange({ techStack: e.target.value })}
            placeholder="React, Node.js, PostgreSQL, AWS..."
          />
          <InputField
            label="Scalability Score (1–10)"
            type="number"
            value={data.scalability}
            onChange={(e) =>
              onChange({ scalability: clamp(num(e.target.value), 1, 10) })
            }
            min={1}
            max={10}
          />
          <div className="space-y-4 pt-2">
            <ToggleField
              label="AI Usage in Product"
              checked={data.aiUsage}
              onChange={(v) => onChange({ aiUsage: v })}
            />
            <ToggleField
              label="Cloud Infrastructure"
              checked={data.cloudInfrastructure}
              onChange={(v) => onChange({ cloudInfrastructure: v })}
            />
            <ToggleField
              label="Security & Compliance"
              checked={data.security}
              onChange={(v) => onChange({ security: v })}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function MultiStepForm({
  step,
  data,
  onChange,
}: StepContentProps) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <StepContent step={step} data={data} onChange={onChange} />
    </motion.div>
  )
}
