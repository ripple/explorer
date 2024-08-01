import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { Amount } from '../Amount'
import i18n from '../../../../i18n/testConfig'

describe('Amount', () => {
  afterEach(cleanup)
  const renderComponent = (component: JSX.Element) =>
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{component}</BrowserRouter>
      </I18nextProvider>,
    )

  it('handles currency codes that are 3 characters ', () => {
    const value = {
      amount: 95.13258522535791,
      currency: 'DYM',
      issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    }

    renderComponent(<Amount value={value} />)
    expect(screen.getByTestId('currency')).toHaveTextContent(
      'DYM.rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    )
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '95.13258523',
    )
  })

  it('handles currency codes with standard symbols', () => {
    const value = {
      amount: 4986.30908732758,
      currency: 'JPY',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    }

    renderComponent(<Amount value={value} />)
    expect(screen.getByTestId('currency')).toHaveTextContent(
      'JPY.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    )
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '¥4,986.30908733',
    )
  })

  it('handles currency codes with standard symbols', () => {
    const value2 = {
      amount: 78.5098894970562,
      currency: 'GBP',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    }

    renderComponent(<Amount value={value2} />)
    expect(screen.getByTestId('currency')).toHaveTextContent(
      'GBP.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    )
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '£78.5098895',
    )
  })

  it('handles currency codes that are 4 characters ', () => {
    const value = {
      amount: 95.13258522535791,
      currency: 'WOOT',
      issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    }

    renderComponent(<Amount value={value} />)
    expect(screen.getByTestId('currency')).toHaveTextContent(
      'WOOT.rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    )
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '95.13258523',
    )
  })

  it('handles currency codes that are 40 characters ', () => {
    const value = {
      amount: 3.692385398244198,
      currency: '0158415500000000C1F76FF6ECB0BAC600000000',
      issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
    }
    renderComponent(<Amount value={value} />)
    expect(screen.getByTestId('currency')).toHaveTextContent(
      'XAUÁ÷oöì°ºÆ.rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
    )
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '3.6923854',
    )
  })

  it('handles currency codes that are 40 characters and hidden issuer', () => {
    const value = {
      amount: 3.692385398244198,
      currency: '0158415500000000C1F76FF6ECB0BAC600000000',
      issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
    }
    renderComponent(<Amount value={value} displayIssuer={false} />)
    expect(screen.getByTestId('currency')).toHaveTextContent('XAUÁ÷oöì°ºÆ')
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '3.6923854',
    )
  })

  it('handles XRP-style amounts', () => {
    const value = '1000'
    renderComponent(<Amount value={value} displayIssuer={false} />)
    expect(screen.getByTestId('currency')).toHaveTextContent('XRP')
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '\uE9000.001',
    )
  })

  it('handles modifier', () => {
    const value = '9000'
    renderComponent(<Amount value={value} displayIssuer={false} modifier="+" />)
    expect(screen.getByTestId('currency')).toHaveTextContent('XRP')
    expect(screen.getByTestId('amount-localized')).toHaveTextContent(
      '+\uE9000.009',
    )
  })
})
