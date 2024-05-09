import i18n from '../../../../../../i18n/testConfigEnglish'

import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('AccountSet: Description', () => {
  it('renders tx that sets the domain', () => {
    const wrapper = createWrapper(mockAccountSetWithDomain)
    expect(wrapper).toHaveText('It sets the account domain as mduo13.com')
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
    expect(wrapper).toHaveText(
      'It sets the account email hash as 7AC3878BF42A5329698F468A6AAA03B9',
    )
    wrapper.unmount()
  })

  it('renders tx that clears a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithClearFlag)
    expect(wrapper).toHaveText('It clears the account flag asfGlobalFreeze')
    wrapper.unmount()
  })

  it('renders tx that sets a flag', () => {
    const wrapper = createWrapper(mockAccountSetWithSetFlag)
    expect(wrapper).toHaveText('It sets the account flag asfRequireDest')
    wrapper.unmount()
  })

  it('renders tx that clears a flag that is not defined', () => {
    const wrapper = createWrapper({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expect(wrapper).toHaveText('It clears the account flag 45')
    wrapper.unmount()
  })

  it('renders tx that sets a flag that is not defined', () => {
    const wrapper = createWrapper({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expect(wrapper).toHaveText('It sets the account flag 45')
    wrapper.unmount()
  })

  it('renders tx that sets a message', () => {
    const wrapper = createWrapper(mockAccountSetWithMessageKey)
    expect(wrapper.find('[data-testid="message-key"]')).toHaveText(
      'It sets the account message key as 020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
    wrapper.unmount()
  })

  it('renders tx that sets a minter', () => {
    const wrapper = createWrapper(mockAccountSetWithNFTokenMinter)
    expect(wrapper.find('[data-testid="minter"]')).toHaveText(
      'It sets rXMART8usFd5kABXCayoP6ZfB35b4v43t as the authorized minter for this account',
    )
    wrapper.unmount()
  })
})
