const uuidPattern = /^[0-9a-fA-F-]{36}$/

export const normalizeCurrencyIdentifier = (identifier: string) => {
  const trimmed = identifier.trim()

  if (uuidPattern.test(trimmed)) {
    return trimmed
  }

  return trimmed.toUpperCase()
}

export const isSameCurrency = (a?: string, b?: string) => {
  if (!a || !b) return false

  return normalizeCurrencyIdentifier(a) === normalizeCurrencyIdentifier(b)
}
