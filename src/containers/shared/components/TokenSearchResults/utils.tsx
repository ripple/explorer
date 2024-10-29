export const parsePrice = (dollarPrice: string, xrpPrice: number): number => {
  const parsedDollar = Number(dollarPrice)
  return Number((parsedDollar * xrpPrice).toFixed(6))
}

// remove protocol prefixes and postfixes from a URL to display
export const stripDomain = (domain: string): string => {
  let result = domain

  if (domain.startsWith('www.')) {
    result = result.substring(4)
  } else if (domain.startsWith('http://')) {
    result = result.substring(7)
  } else if (domain.startsWith('https://')) {
    result = result.substring(8)
  }

  if (domain.endsWith('/')) {
    result = result.substring(0, result.length - 1)
  }

  return result
}
