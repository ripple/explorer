import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const createWrapper = createSimpleRenderFactory(Simple, i18n)

describe('AccountSet: Simple', () => {
  it('renders tx that sets the domain', () => {
    const wrapper = createWrapper(mockAccountSetWithDomain)
    expectSimpleRowLabel(wrapper, 'domain', 'domain')
    expectSimpleRowText(wrapper, 'domain', 'mduo13.com')
    wrapper.unmount()
  })

  it('renders tx that sets the email hash', () => {
    const wrapper = createWrapper({
      ...mockAccountSetWithDomain,
      tx: {
        ...mockAccountSetWithDomain.tx,
        Domain: undefined,
        EmailHash: '7AC3878BF42A5329698F468A6AAA03B9',
      },
    })

    expectSimpleRowLabel(wrapper, 'email', 'email hash')
    expectSimpleRowText(wrapper, 'email', '7AC3878BF42A5329698F468A6AAA03B9')
  })

  it('renders tx that clears a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithClearFlag)
    expectSimpleRowLabel(wrapper, 'clear-flag', 'clear flag')
    expectSimpleRowText(wrapper, 'clear-flag', 'asfGlobalFreeze')
    wrapper.unmount()
  })

  it('renders tx that sets a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithSetFlag)
    expectSimpleRowLabel(wrapper, 'set-flag', 'set flag')
    expectSimpleRowText(wrapper, 'set-flag', 'asfRequireDest')
    wrapper.unmount()
  })

  it('renders tx that clears a flag without a defined flag', () => {
    const wrapper = createWrapper({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expectSimpleRowLabel(wrapper, 'clear-flag', 'clear flag')
    expectSimpleRowText(wrapper, 'clear-flag', '45')
    wrapper.unmount()
  })

  it('renders tx that sets a flag without a defined flag', () => {
    const wrapper = createWrapper({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expectSimpleRowLabel(wrapper, 'set-flag', 'set flag')
    expectSimpleRowText(wrapper, 'set-flag', '45')
    wrapper.unmount()
  })

  it('renders tx that sets a message', () => {
    const wrapper = createWrapper(mockAccountSetWithMessageKey)
    expectSimpleRowLabel(wrapper, 'message', 'message key')
    expectSimpleRowText(
      wrapper,
      'message',
      '020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
    wrapper.unmount()
  })

  it('renders tx that sets a minter', () => {
    const wrapper = createWrapper(mockAccountSetWithNFTokenMinter)
    expectSimpleRowLabel(wrapper, 'minter', 'NFT Minter')
    expectSimpleRowText(wrapper, 'minter', 'rXMART8usFd5kABXCayoP6ZfB35b4v43t')
    wrapper.unmount()
  })
})
