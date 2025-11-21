import type { Branch } from '@/types/branch.types'

export const formatBranchLabel = (
  branch?: Partial<Branch> | null,
  fallbackName?: string | null,
  fallbackId?: string | null
) => {
  const name = branch?.name_en ?? branch?.name ?? fallbackName ?? undefined
  const code = branch?.code

  if (code && name) return `${code} - ${name}`
  if (code) return code
  if (name && fallbackId) return `${name} (${fallbackId})`

  return name ?? fallbackId ?? 'Unknown branch'
}
