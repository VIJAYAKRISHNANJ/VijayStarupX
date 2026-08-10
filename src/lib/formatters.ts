export function formatCurrencyINR(amount: number): string {
  if (amount >= 1e7) {
    const crores = amount / 1e7
    return `₹${crores.toFixed(1)} ${crores === 1 ? 'Crore' : 'Crores'}`
  }
  if (amount >= 1e5) {
    const lakhs = amount / 1e5
    return `₹${lakhs.toFixed(1)} ${lakhs === 1 ? 'Lakh' : 'Lakhs'}`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function formatPercent(n: number): string {
  return `${n.toFixed(0)}%`
}
