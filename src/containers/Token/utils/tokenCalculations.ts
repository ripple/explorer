/**
 * Checks if loading state should show spinner for market data
 */
export const shouldShowLoadingSpinner = (
  isLoading: boolean | undefined,
  value: string | number | undefined,
): boolean => !!isLoading || !value || value === ''
