import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'
import { SimpleRow } from '../../SimpleRow'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('SignerListSet: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockSignerListSet)

    expect(screen.getByTestId("quorum"] .value').text()).toEqual(
      '3 out_of 4',
    )

    const signers = screen.getByTestId("signers"] .value li')
    expect(signers.at(0)).toHaveTextContent(
      'rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv weight: 2',
    )
    expect(signers.at(1)).toHaveTextContent(
      'rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP weight: 1',
    )
    expect(signers.at(2)).toHaveTextContent(
      'rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy weight: 1',
    )
  })

  it('renders when signer list is cleared', () => {
    renderComponent(mockSignerListSetClear)
    expect(screen.find(SimpleRow)).toHaveTextContent('unset_signer_list')
  })
})
