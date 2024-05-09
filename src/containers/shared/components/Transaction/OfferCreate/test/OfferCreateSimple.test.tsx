import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('OfferCreate: Simple', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockOfferCreateWithCancel)
    expect(screen.getByTestId('amount')).toHaveTextContent(
      '\uE900 XRP/CSC.rCSC',
    )
    expect(screen.getByTestId('cancel-id')).toHaveTextContent('#44866443')
    expect(screen.getByTestId('amount-buy')).toHaveTextContent(
      `\uE9001,764.293151 XRP`,
    )
    expect(screen.getByTestId('amount-sell')).toHaveTextContent(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
  })

  it('renders', () => {
    renderComponent(mockOfferCreate)

    expect(screen.getByTestId('offer-id')).not.toExist()
    expect(screen.getByTestId('amount-buy')).toHaveTextContent(
      `\uE90024,755.081083 XRP`,
    )
    expect(screen.getByTestId('amount-sell')).toHaveTextContent(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
  })
})
