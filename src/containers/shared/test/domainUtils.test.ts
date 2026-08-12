import { getRegistrableDomain, shortenDomainFromLeft } from '../domainUtils'

describe('getRegistrableDomain', () => {
  it('reduces a full URL to its registrable domain', () => {
    expect(
      getRegistrableDomain(
        'https://www.franklintempleton.com/about-us/our-teams/specialist-investment-managers/digital-assets/',
      ),
    ).toBe('franklintempleton.com')
  })

  it('drops the scheme, www, subdomains, path, and query', () => {
    expect(getRegistrableDomain('https://a.b.c.example.com/x?y=1#z')).toBe(
      'example.com',
    )
  })

  it('keeps multi-part public suffixes (does not collapse thing.co.uk to co.uk)', () => {
    expect(getRegistrableDomain('https://sub.thing.co.uk/path?q=1')).toBe(
      'thing.co.uk',
    )
    expect(getRegistrableDomain('thing.co.uk')).toBe('thing.co.uk')
  })

  it('handles a bare domain without a scheme', () => {
    expect(getRegistrableDomain('franklintempleton.com')).toBe(
      'franklintempleton.com',
    )
  })

  it('falls back to the host for inputs without a registrable domain', () => {
    // ipfs URIs have no public suffix; fall back to the first path segment.
    expect(getRegistrableDomain('ipfs://QmHash/file.json')).toBe('QmHash')
    // localhost has no public suffix.
    expect(getRegistrableDomain('http://localhost:3000/x')).toBe(
      'localhost:3000',
    )
  })

  it('returns the input unchanged when empty', () => {
    expect(getRegistrableDomain('')).toBe('')
  })
})

describe('shortenDomainFromLeft', () => {
  it('returns the domain unchanged when within the max length', () => {
    expect(shortenDomainFromLeft('franklintempleton.com', 30)).toBe(
      'franklintempleton.com',
    )
  })

  it('truncates from the left with a leading ellipsis, preserving the TLD', () => {
    const result = shortenDomainFromLeft(
      'a-very-long-domain-name-that-overflows.example.com',
      24,
    )
    expect(result.startsWith('…')).toBe(true)
    expect(result).toHaveLength(24)
    // The TLD survives the truncation.
    expect(result.endsWith('example.com')).toBe(true)
  })

  it('handles an empty string', () => {
    expect(shortenDomainFromLeft('')).toBe('')
  })
})
