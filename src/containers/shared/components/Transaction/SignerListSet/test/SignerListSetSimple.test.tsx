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

    expect(screen.find('[data-testid="quorum"] .value').text()).toEqual(
      '3 out_of 4',
    )

    const signers = screen.find('[data-testid="signers"] .value li')
    expect(signers.at(0)).toHaveText(
      'rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv weight: 2',
    )
    expect(signers.at(1)).toHaveText(
      'rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP weight: 1',
    )
    expect(signers.at(2)).toHaveText(
      'rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy weight: 1',
    )
  })

  it('renders when signer list is cleared', () => {
    renderComponent(mockSignerListSetClear)
    expect(screen.find(SimpleRow)).toHaveText('unset_signer_list')
  })
})
