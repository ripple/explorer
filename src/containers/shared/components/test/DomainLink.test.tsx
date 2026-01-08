import { render, screen } from '@testing-library/react'
import DomainLink from '../DomainLink'

describe('DomainLink', () => {
  it('handles domain link with only domain parameter', () => {
    render(<DomainLink domain="bithomp.com" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent('bithomp.com')
    expect(link).toHaveAttribute('href', 'https://bithomp.com')
  })

  it('handles domain link with decoded domain parameter', () => {
    render(<DomainLink decode domain="736F6C6F67656E69632E636F6D" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent('sologenic.com')
    expect(link).toHaveAttribute('href', 'https://sologenic.com')
  })

  it('handles domain link with domain parameter and classname', () => {
    render(<DomainLink className="test" domain="bithomp.com" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain test')
    expect(link).toHaveTextContent('bithomp.com')
    expect(link).toHaveAttribute('href', 'https://bithomp.com')
  })

  it('handles domain link with decoded domain parameter and classname', () => {
    render(
      <DomainLink
        className="test"
        decode
        domain="736F6C6F67656E69632E636F6D"
      />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain test')
    expect(link).toHaveTextContent('sologenic.com')
    expect(link).toHaveAttribute('href', 'https://sologenic.com')
  })

  it('handles domain link with domain provided in HEX-encoded format', () => {
    const url = 'https://example.com'
    const urlInHex = '68747470733A2F2F6578616D706C652E636F6D'
    render(<DomainLink decode domain={urlInHex} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent(url)
    expect(link).toHaveAttribute('href', url)
  })

  it('handles IPFS domain link', () => {
    render(<DomainLink domain="ipfs://random/metadata.json" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent('ipfs://random/metadata.json')
    expect(link).toHaveAttribute(
      'href',
      'https://ipfs.io/ipfs/random/metadata.json',
    )
  })

  it('handles domain link with protocol removal', () => {
    const url = 'https://example.com/'
    render(<DomainLink domain={url} keepProtocol={false} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent('example.com')
    expect(link).toHaveAttribute('href', 'https://example.com/')
  })

  it('handles domain link with displayDomain', () => {
    render(
      <DomainLink domain="bithomp.com" displayDomain="Custom Display Text" />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('domain')
    expect(link).toHaveTextContent('Custom Display Text')
    expect(link).toHaveAttribute('href', 'https://bithomp.com')
  })
})
