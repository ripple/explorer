/**
 * Determines if a loading spinner should be displayed for market data
 * Shows spinner if data is loading or if the value is empty/falsy
 * @param isLoading - Whether data is currently loading
 * @param value - The data value to check
 * @returns true if spinner should be shown, false otherwise
 */
export const shouldShowLoadingSpinner = (
  isLoading: boolean | undefined,
  value: string | number | undefined,
): boolean => !!isLoading || !value || value === ''
