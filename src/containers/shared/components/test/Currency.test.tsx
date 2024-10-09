import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import Currency from '../Currency'

describe('Currency', () => {
  afterEach(cleanup)
  it('handles currency codes that are 3 characters ', () => {
    render(<Currency currency="BTC" />)
    const element = screen.getByTestId('currency')
    expect(element).toHaveClass('currency')
    expect(element).toHaveTextContent('BTC')
  })

  it('handles currency codes that are 4 characters ', () => {
    render(<Currency currency="WOOT" />)
    const element = screen.getByTestId('currency')
    expect(element).toHaveClass('currency')
    expect(element).toHaveTextContent('WOOT')
  })

  it('handles currency codes that are 4 characters and include issuer ', () => {
    render(
      <Currency currency="USD" issuer="david" link={false} shortenIssuer />,
    )
    const element = screen.getByTestId('currency')
    expect(element).toHaveClass('currency')
    expect(element).toHaveTextContent('USD.davi')
  })

  it('handles currency codes that are 40 characters ', () => {
    render(<Currency currency="584D455441000000000000000000000000000000" />)
    const element = screen.getByTestId('currency')
    expect(element).toHaveClass('currency')
    expect(element).toHaveTextContent('XMETA')
  })

  it('handles currency codes that are 40 characters and issuer ', () => {
    render(
      <BrowserRouter>
        <Currency
          currency="584D455441000000000000000000000000000000"
          issuer="r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB"
        />
        <Currency currency="USD" issuer="rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq" />
      </BrowserRouter>,
    )
    const elements = screen.getAllByTestId('currency')
    expect(elements).toHaveLength(2)
    expect(elements[0]).toHaveClass('currency')
    expect(elements[1]).toHaveClass('currency')

    const meta = elements[0]
    const usd = elements[1]

    expect(meta).toHaveTextContent('XMETA.r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB')
    expect(meta).toHaveAttribute(
      'href',
      '/token/584D455441000000000000000000000000000000.r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB',
    )

    expect(usd).toHaveTextContent('USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq')
    expect(usd).toHaveAttribute(
      'href',
      '/token/USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    )
  })

  it('displays the XRP symbol when rendering XRP', () => {
    render(<Currency currency="XRP" />)
    const element = screen.getByTestId('currency')
    expect(element).toHaveClass('currency')
    expect(element).toHaveTextContent('\uE900 XRP')
  })
})
