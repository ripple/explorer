import { cleanup, screen } from '@testing-library/react'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description)

describe('SignerListSet: Description', () => {
  afterEach(cleanup)
  it('renders', () => {
    const { container } = renderComponent(mockSignerListSet)

    expect(container).toHaveTextContent('set_signer_list_description:')

    const signers = screen.getAllByTestId('signer')

    expect(signers[0]).toHaveTextContent(
      'rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv - weight: 2',
    )
    expect(signers[1]).toHaveTextContent(
      'rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP - weight: 1',
    )
    expect(signers[2]).toHaveTextContent(
      'rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy - weight: 1',
    )
  })

  it('renders when signer list is cleared', () => {
    const { container } = renderComponent(mockSignerListSetClear)
    expect(container).toHaveTextContent('unset_signer_list_description')
  })
})
