import { cleanup, render, screen } from '@testing-library/react'
import DomainLink from '../DomainLink'

const checkDomain = (
  param: string,
  expectedText: string,
  expectedDomain: string,
  decode: boolean = false,
) => {
  const { container } = render(<DomainLink domain={param} decode={decode} />)
  expect(container).toHaveTextContent(expectedText)
  expect(screen.getByText(expectedText)).toHaveAttribute('href', expectedDomain)
}

describe('DomainLink', () => {
  afterEach(cleanup)
  it('handles domain link with only domain parameter', () => {
    checkDomain('bithomp.com', 'bithomp.com', 'https://bithomp.com')
  })

  it('handles domain link with decoded domain parameter', () => {
    checkDomain(
      '736F6C6F67656E69632E636F6D',
      'sologenic.com',
      'https://sologenic.com',
      true,
    )
  })

  it('handles domain link with domain parameter and classname', () => {
    const { container } = render(
      <DomainLink className="test" domain="bithomp.com" />,
    )
    expect(container).toHaveTextContent('bithomp.com')
    expect(screen.getByText('bithomp.com')).toHaveAttribute(
      'href',
      'https://bithomp.com',
    )
    expect(screen.getByText('bithomp.com')).toHaveClass('test')
  })

  it('handles domain link with decoded domain parameter and classname', () => {
    checkDomain(
      '736F6C6F67656E69632E636F6D',
      'sologenic.com',
      'https://sologenic.com',
      true,
    )
  })

  it('handles domain link with domain provided in HEX-encoded format', () => {
    checkDomain(
      '68747470733A2F2F6578616D706C652E636F6D',
      'https://example.com',
      'https://example.com',
      true,
    )
  })

  it('handles IPFS domain link', () => {
    checkDomain(
      'ipfs://random/metadata.json',
      'ipfs://random/metadata.json',
      'https://ipfs.io/ipfs/random/metadata.json',
    )
  })
})
