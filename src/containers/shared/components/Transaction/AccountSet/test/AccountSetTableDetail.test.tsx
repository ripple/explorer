import { describe, it, expect } from 'vitest'
import { createTableDetailWrapperFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { TableDetail } from '../TableDetail'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('AccountSet: TableDetail', () => {
  it('renders tx that sets the domain', () => {
    const wrapper = createWrapper(mockAccountSetWithDomain)
    expect(wrapper).toHaveText('domain: mduo13.com')
    wrapper.unmount()
  })

  it('renders tx that clears a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithClearFlag)
    expect(wrapper).toHaveText('clear flag: asfGlobalFreeze')
    wrapper.unmount()
  })

  it('renders tx that sets a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithSetFlag)
    expect(wrapper).toHaveText('set flag: asfRequireDest')
    wrapper.unmount()
  })

  it('renders tx that sets a message', () => {
    const wrapper = createWrapper(mockAccountSetWithMessageKey)
    expect(wrapper).toHaveText(
      'message key: 020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
    wrapper.unmount()
  })

  it('renders tx that sets a minter', () => {
    const wrapper = createWrapper(mockAccountSetWithNFTokenMinter)
    expect(wrapper.find('[data-test="minter"]')).toHaveText(
      'NFT Minter: rXMART8usFd5kABXCayoP6ZfB35b4v43t',
    )
    wrapper.unmount()
  })
})
