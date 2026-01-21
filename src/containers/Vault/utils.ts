/**
 * Decode the Data field from hex to UTF-8 if needed
 */
export const decodeVaultData = (data: string | undefined): string | undefined => {
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
