/**
 * Truncates a string by showing the start and end portions with ellipsis in the middle
 * @param address - The string to truncate
 * @param startLength - Number of characters to show from the start (default: 6)
 * @param endLength - Number of characters to show from the end (default: 6)
 * @returns Truncated string or original if shorter than total length
 */
export function truncateString(
  address: string | null | undefined,
  startLength: number = 6,
  endLength: number = 6,
): string {
  if (!address || address.length <= startLength + endLength) {
    return address || ''
  }
  const start = address.slice(0, startLength)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}
