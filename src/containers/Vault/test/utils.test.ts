import { parseVaultWebsite } from '../utils'

describe('parseVaultWebsite', () => {
  it('returns website when Data contains valid JSON with "w" key', () => {
    // {"n":"Test Vault","w":"example.com"} encoded as hex
    const hexData = Buffer.from(
      JSON.stringify({ n: 'Test Vault', w: 'example.com' }),
    ).toString('hex')

    expect(parseVaultWebsite(hexData)).toBe('example.com')
  })

  it('returns undefined when Data contains valid JSON but missing "w" key', () => {
    // {"n":"Test Vault"} encoded as hex (no website field)
    const hexData = Buffer.from(JSON.stringify({ n: 'Test Vault' })).toString(
      'hex',
    )

    expect(parseVaultWebsite(hexData)).toBeUndefined()
  })

  it('returns undefined when Data is not valid JSON', () => {
    // "Hello World" encoded as hex (plain text, not JSON)
    const hexData = Buffer.from('Hello World').toString('hex')

    expect(parseVaultWebsite(hexData)).toBeUndefined()
  })
})
