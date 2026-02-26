import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AccountSet: Simple', () => {
  it('renders tx that sets the domain', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithDomain)
    expectSimpleRowLabel(container, 'domain', 'domain')
    expectSimpleRowText(container, 'domain', 'mduo13.com')
    unmount()
  })

  it('renders tx that sets the email hash', () => {
    const { container } = renderComponent({
      ...mockAccountSetWithDomain,
      tx: {
        ...mockAccountSetWithDomain.tx,
        Domain: undefined,
        EmailHash: '7AC3878BF42A5329698F468A6AAA03B9',
      },
    })

    expectSimpleRowLabel(container, 'email', 'email hash')
    expectSimpleRowText(container, 'email', '7AC3878BF42A5329698F468A6AAA03B9')
  })

  it('renders tx that clears a flag', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithClearFlag)
    expectSimpleRowLabel(container, 'clear-flag', 'clear flag')
    expectSimpleRowText(container, 'clear-flag', 'asfGlobalFreeze')
    unmount()
  })

  it('renders tx that sets a flag', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithSetFlag)
    expectSimpleRowLabel(container, 'set-flag', 'set flag')
    expectSimpleRowText(container, 'set-flag', 'asfRequireDest')
    unmount()
  })

  it('renders tx that clears a flag without a defined flag', () => {
    const { container, unmount } = renderComponent({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expectSimpleRowLabel(container, 'clear-flag', 'clear flag')
    expectSimpleRowText(container, 'clear-flag', '45')
    unmount()
  })

  it('renders tx that sets a flag without a defined flag', () => {
    const { container, unmount } = renderComponent({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expectSimpleRowLabel(container, 'set-flag', 'set flag')
    expectSimpleRowText(container, 'set-flag', '45')
    unmount()
  })

  it('renders tx that sets a message', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithMessageKey)
    expectSimpleRowLabel(container, 'message', 'message key')
    expectSimpleRowText(
      container,
      'message',
      '020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
    unmount()
  })

  it('renders tx that sets a minter', () => {
    const { container, unmount } = renderComponent(
      mockAccountSetWithNFTokenMinter,
    )
    expectSimpleRowLabel(container, 'minter', 'NFT Minter')
    expectSimpleRowText(
      container,
      'minter',
      'rXMART8usFd5kABXCayoP6ZfB35b4v43t',
    )
    unmount()
  })
})
