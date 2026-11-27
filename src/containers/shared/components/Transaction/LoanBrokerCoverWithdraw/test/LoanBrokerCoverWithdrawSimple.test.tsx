import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerCoverWithdraw from './mock_data/LoanBrokerCoverWithdraw.json'
import LoanBrokerCoverWithdrawWithCredentials from './mock_data/LoanBrokerCoverWithdrawWithCredentials.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanBrokerCoverWithdraw: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(LoanBrokerCoverWithdraw)
    expectSimpleRowText(
      container,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      container,
      'amount',
      '$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rH4absn9JcB8m943YRMNJpuR9HQs56hkr8',
    )
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders credential IDs when present', () => {
    const { container, unmount } = renderComponent(
      LoanBrokerCoverWithdrawWithCredentials,
    )
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).toHaveTextContent(
      'EA85E9D5B4F0D8E36C5F1A4B8C2D3E4F5061728394A5B6C7D8E9F0A1B2C3D4E5',
    )
    expect(
      container.querySelector('[data-testid="credential-id-1"]'),
    ).toHaveTextContent(
      'FB96FAE6C501E9F47D6F2B5C9D3E4F5061728394A5B6C7D8E9F0A1B2C3D4E5F6',
    )
    unmount()
  })
})
