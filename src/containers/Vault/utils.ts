
/**
 * Decode the Data field from hex to UTF-8 if needed
 */
export const decodeVaultData = (
  data: string | undefined,
): string | undefined => {
  if (!data) return undefined

  // Try to decode hex string to UTF-8
  if (/^[0-9A-Fa-f]+$/.test(data)) {
    try {
      return Buffer.from(data, 'hex').toString('utf8')
    } catch {
      return data
    }
  }

  return data
}

/**
 * Vault Data JSON Convention
 * Field names are short to fit within 256-byte limit:
 * - n: Human-readable name of the Vault
 * - w: Website associated with the Vault operator
 */
interface VaultDataJson {
  n?: string // name
  w?: string // website
}

/**
 * Parse the vault data JSON from the Data field.
 * Returns the parsed object if valid JSON, otherwise undefined.
 */
const parseVaultDataJson = (
  data: string | undefined,
): VaultDataJson | undefined => {
  const decoded = decodeVaultData(data)
  if (!decoded) return undefined

  try {
    const parsed: VaultDataJson = JSON.parse(decoded)
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch {
    // Not valid JSON, return undefined
  }

  return undefined
}

/**
 * Parse the vault name from the Data field if it follows the JSON convention.
 * Returns the name (n field) if the data is valid JSON with a name field,
 * otherwise returns undefined.
 */
export const parseVaultName = (
  data: string | undefined,
): string | undefined => {
  if (!data) return undefined

  const parsed = parseVaultDataJson(data)
  if (parsed && typeof parsed.n === 'string' && parsed.n.trim()) {
    return parsed.n.trim()
  }
  return undefined
}

/**
 * Parse the vault website from the Data field if it follows the JSON convention.
 * Returns the website (w field) if the data is valid JSON with a website field,
 * otherwise returns undefined.
 */
export const parseVaultWebsite = (
  data: string | undefined,
): string | undefined => {
  const parsed = parseVaultDataJson(data)
  if (parsed && typeof parsed.w === 'string' && parsed.w.trim()) {
    return parsed.w.trim()
  }
  return undefined
}
