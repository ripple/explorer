import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AccountSet: Simple', () => {
  afterEach(cleanup)
  it('renders tx that sets the domain', () => {
    renderComponent(mockAccountSetWithDomain)
    expectSimpleRowLabel(screen, 'domain', 'domain')
    expectSimpleRowText(screen, 'domain', 'mduo13.com')
  })

  it('renders tx that sets the email hash', () => {
    renderComponent({
      ...mockAccountSetWithDomain,
      tx: {
        ...mockAccountSetWithDomain.tx,
        Domain: undefined,
        EmailHash: '7AC3878BF42A5329698F468A6AAA03B9',
      },
    })

    expectSimpleRowLabel(screen, 'email', 'email hash')
    expectSimpleRowText(screen, 'email', '7AC3878BF42A5329698F468A6AAA03B9')
  })

  it('renders tx that clears a flag', () => {
    renderComponent(mockAccountSetWithClearFlag)
    expectSimpleRowLabel(screen, 'clear-flag', 'clear flag')
    expectSimpleRowText(screen, 'clear-flag', 'asfGlobalFreeze')
  })

  it('renders tx that sets a flag', () => {
    renderComponent(mockAccountSetWithSetFlag)
    expectSimpleRowLabel(screen, 'set-flag', 'set flag')
    expectSimpleRowText(screen, 'set-flag', 'asfRequireDest')
  })

  it('renders tx that clears a flag without a defined flag', () => {
    renderComponent({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expectSimpleRowLabel(screen, 'clear-flag', 'clear flag')
    expectSimpleRowText(screen, 'clear-flag', '45')
  })

  it('renders tx that sets a flag without a defined flag', () => {
    renderComponent({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expectSimpleRowLabel(screen, 'set-flag', 'set flag')
    expectSimpleRowText(screen, 'set-flag', '45')
  })

  it('renders tx that sets a message', () => {
    renderComponent(mockAccountSetWithMessageKey)
    expectSimpleRowLabel(screen, 'message', 'message key')
    expectSimpleRowText(
      screen,
      'message',
      '020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
  })

  it('renders tx that sets a minter', () => {
    renderComponent(mockAccountSetWithNFTokenMinter)
    expectSimpleRowLabel(screen, 'minter', 'NFT Minter')
    expectSimpleRowText(screen, 'minter', 'rXMART8usFd5kABXCayoP6ZfB35b4v43t')
  })
})
