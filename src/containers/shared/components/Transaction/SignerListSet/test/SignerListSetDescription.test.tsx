import { cleanup, screen } from '@testing-library/react'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description)

describe('SignerListSet: Description', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockSignerListSet)

    expect(wrapper.find('div').at(0).text()).toEqual(
      'set_signer_list_description:',
    )

    const signers = wrapper.find('.signers li')
    expect(signers.at(0)).toHaveText(
      'rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv - weight: 2',
    )
    expect(signers.at(1)).toHaveText(
      'rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP - weight: 1',
    )
    expect(signers.at(2)).toHaveText(
      'rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy - weight: 1',
    )
  })

  it('renders when signer list is cleared', () => {
    renderComponent(mockSignerListSetClear)
    expect(wrapper).toHaveText('unset_signer_list_description')
    wrapper.unmount()
  })
})
