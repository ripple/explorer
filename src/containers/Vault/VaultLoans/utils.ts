// 1/10th basis point = 0.001%
const ONE_TENTH_BASIS_POINT = 1000

/**
 * Decode the broker name from the Data field (hex-encoded)
 * If no data or decoding fails, return a default name
 */
export const decodeBrokerName = (
  data: string | undefined,
  index: number,
): string => {
  if (!data) return `Broker ${index + 1}`

  // Try to decode hex string to UTF-8
  if (/^[0-9A-Fa-f]+$/.test(data)) {
    try {
      const decoded = Buffer.from(data, 'hex').toString('utf8')
      // Try to parse as JSON and extract name
      try {
        const json = JSON.parse(decoded)
        if (json.name) return json.name
        return decoded
      } catch {
        // Not JSON, return the decoded string directly
        return decoded || `Broker ${index + 1}`
      }
    } catch {
      return `Broker ${index + 1}`
    }
  }

  return data || `Broker ${index + 1}`
}

/**
 * Format a rate value from 1/10th basis points to percentage string
 * e.g., 50 (1/10th bps) -> "0.50%"
 */
export const formatRate = (rate: number | undefined): string => {
  if (rate === undefined) return '-'

  // Convert from 1/10th basis points to percentage
  // 1 basis point = 0.01%, 1/10th basis point = 0.001%
  const percentage = rate / ONE_TENTH_BASIS_POINT

  // Format with appropriate decimal places
  return `${percentage.toFixed(2)}%`
}
