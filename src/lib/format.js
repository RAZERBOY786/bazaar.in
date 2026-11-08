export const inr = (n) =>
  '\u20B9' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const inrDecimal = (n) =>
  '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const discountPct = (mrp, price) => {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

export const deliveryDate = (days = 3) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const longDate = (value) => {
  const d = value ? new Date(value) : new Date()
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export const makeOrderId = () => {
  const rnd = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('')
  return `${rnd(3)}-${rnd(7)}-${rnd(7)}`
}

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
