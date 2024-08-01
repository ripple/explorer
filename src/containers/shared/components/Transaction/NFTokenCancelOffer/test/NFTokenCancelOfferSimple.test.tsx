import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import transaction from './mock_data/NFTokenCancelOffer.json'
import { createSimpleRenderFactory } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenCancelOffer', () => {
  afterEach(cleanup)
  it.only('handles NFTokenCancelOffer simple view ', () => {
    renderComponent(transaction)
    expect(screen.getByTestId('token-id')).toHaveTextContent(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C258BA1B200000018',
    )
    expect(screen.getByTestId('offer-id')).toHaveTextContent(
      '35F3D6D99548FA5F5315580FBF8BA6B15CAA2CAE93023D5CE4FDC130602BC5C3',
    )
    expect(screen.getByTestId('offer-amount')).toHaveTextContent(
      '$100.00 USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(screen.getByTestId('offerer')).toHaveTextContent(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
  })
})
