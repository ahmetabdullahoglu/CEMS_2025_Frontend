export const formatAmount = (
  value: string | number | null | undefined,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string => {
  if (value === null || value === undefined || value === '') return '—'

  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return '—'

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  })

  return formatter.format(num)
}
