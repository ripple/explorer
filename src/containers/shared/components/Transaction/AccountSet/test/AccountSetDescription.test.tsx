import i18n from '../../../../../../i18n/testConfigEnglish'

import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('AccountSet: Description', () => {
  it('renders tx that sets the domain', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithDomain)
    expect(container).toHaveTextContent(
      'It sets the account domain as mduo13.com',
    )
    unmount()
  })

  it('renders tx that sets the email hash', () => {
    const { container, unmount } = renderComponent({
      ...mockAccountSetWithDomain,
      tx: {
        ...mockAccountSetWithDomain.tx,
        Domain: undefined,
        EmailHash: '7AC3878BF42A5329698F468A6AAA03B9',
      },
    })
    expect(container).toHaveTextContent(
      'It sets the account email hash as 7AC3878BF42A5329698F468A6AAA03B9',
    )
    unmount()
  })

  it('renders tx that clears a flag', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithClearFlag)
    expect(container).toHaveTextContent(
      'It clears the account flag asfGlobalFreeze',
    )
    unmount()
  })

  it('renders tx that sets a flag', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithSetFlag)
    expect(container).toHaveTextContent(
      'It sets the account flag asfRequireDest',
    )
    unmount()
  })

  it('renders tx that clears a flag that is not defined', () => {
    const { container, unmount } = renderComponent({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expect(container).toHaveTextContent('It clears the account flag 45')
    unmount()
  })

  it('renders tx that sets a flag that is not defined', () => {
    const { container, unmount } = renderComponent({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expect(container).toHaveTextContent('It sets the account flag 45')
    unmount()
  })

  it('renders tx that sets a message', () => {
    const { container, unmount } = renderComponent(mockAccountSetWithMessageKey)
    expect(
      container.querySelector('[data-testid="message-key"]'),
    ).toHaveTextContent(
      'It sets the account message key as 020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
    unmount()
  })

  it('renders tx that sets a minter', () => {
    const { container, unmount } = renderComponent(
      mockAccountSetWithNFTokenMinter,
    )
    expect(container.querySelector('[data-testid="minter"]')).toHaveTextContent(
      'It sets rXMART8usFd5kABXCayoP6ZfB35b4v43t as the authorized minter for this account',
    )
    unmount()
  })
})
