import { Simple } from '../Simple'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'
import { SimpleRow } from '../../SimpleRow'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('SignerListSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockSignerListSet)

    expect(wrapper.find('[data-test="quorum"] .value').text()).toEqual(
      '3 out_of 4',
    )

    const signers = wrapper.find('[data-test="signers"] .value li')
    expect(signers.at(0)).toHaveText(
      'rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv weight: 2',
    )
    expect(signers.at(1)).toHaveText(
      'rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP weight: 1',
    )
    expect(signers.at(2)).toHaveText(
      'rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy weight: 1',
    )
    wrapper.unmount()
  })

  it('renders when signer list is cleared', () => {
    const wrapper = createWrapper(mockSignerListSetClear)
    expect(wrapper.find(SimpleRow)).toHaveText('unset_signer_list')
    wrapper.unmount()
  })
})
