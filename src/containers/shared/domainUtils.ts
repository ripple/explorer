import { getDomain } from 'tldts'

/**
 * Extracts the registrable domain (eTLD+1) from a URL, dropping the scheme,
 * `www`, any subdomains, the path, and the query string.
 *
 * Uses a real public suffix list (via `tldts`) so multi-part suffixes are
 * handled correctly — e.g. `sub.thing.co.uk` resolves to `thing.co.uk`, not
 * `co.uk`. For inputs without a registrable domain (bare hostnames, `ipfs://`
 * URIs, etc.) it falls back to the host portion of the string.
 *
 * @example
 * getRegistrableDomain('https://www.franklintempleton.com/about-us/x') // 'franklintempleton.com'
 * getRegistrableDomain('https://sub.thing.co.uk/path?q=1')             // 'thing.co.uk'
 *
 * @param url - The URL (or bare domain) to parse.
 * @returns The registrable domain, or a best-effort host fallback.
 */
export const getRegistrableDomain = (url = ''): string => {
  if (!url) {
    return url
  }

  const domain = getDomain(url)
  if (domain) {
    return domain
  }

  // Fallback for inputs tldts can't resolve to a registrable domain
  // (e.g. `ipfs://…`, `localhost`): strip any leading scheme and path/query.
  const host = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').split(/[/?#]/)[0]
  return host || url
}

/**
 * Truncates a domain from the LEFT with a leading ellipsis so the TLD — the
 * part people rely on to judge a link — always survives.
 *
 * @example
 * shortenDomainFromLeft('a-very-long-domain-name.example.com', 24) // '…ong-domain-name.example.com' (trimmed to 24)
 *
 * @param domain - The domain to shorten.
 * @param maxLength - Maximum rendered length, including the ellipsis. Defaults to 30.
 * @returns The domain, left-truncated with a leading `…` when it overflows.
 */
export const shortenDomainFromLeft = (domain = '', maxLength = 30): string =>
  domain.length > maxLength ? `…${domain.slice(-(maxLength - 1))}` : domain
