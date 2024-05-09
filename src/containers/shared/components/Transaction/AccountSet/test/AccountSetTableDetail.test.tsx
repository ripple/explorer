import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { TableDetail } from '../TableDetail'
import mockAccountSetWithDomain from './mock_data/AccountSetWithDomain.json'
import mockAccountSetWithClearFlag from './mock_data/AccountSetWithClearFlag.json'
import mockAccountSetWithSetFlag from './mock_data/AccountSetWithSetFlag.json'
import mockAccountSetWithMessageKey from './mock_data/AccountSetWithMessageKey.json'
import mockAccountSetWithNFTokenMinter from './mock_data/AccountSetWithNFTokenMinter.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('AccountSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders tx that sets the domain', () => {
    renderComponent(mockAccountSetWithDomain)
    expect(wrapper).toHaveText('domain: mduo13.com')
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
    expect(wrapper).toHaveText('email hash: 7AC3878BF42A5329698F468A6AAA03B9')
  })

  it('renders tx that clears a flag', () => {
    renderComponent(mockAccountSetWithClearFlag)
    expect(wrapper).toHaveText('clear flag: asfGlobalFreeze')
  })

  it('renders tx that sets a flag', () => {
    renderComponent(mockAccountSetWithSetFlag)
    expect(wrapper).toHaveText('set flag: asfRequireDest')
  })

  it('renders tx that clears a flag that is not defined', () => {
    renderComponent({
      ...mockAccountSetWithClearFlag,
      tx: { ...mockAccountSetWithClearFlag.tx, ClearFlag: 45 },
    })
    expect(wrapper).toHaveText('clear flag: 45')
  })

  it('renders tx that sets a flag that is not defined', () => {
    renderComponent({
      ...mockAccountSetWithSetFlag,
      tx: { ...mockAccountSetWithSetFlag.tx, SetFlag: 45 },
    })
    expect(wrapper).toHaveText('set flag: 45')
  })

  it('renders tx that sets a message', () => {
    renderComponent(mockAccountSetWithMessageKey)
    expect(wrapper).toHaveText(
      'message key: 020000000000000000000000000941C216565D33C8A8ACD1A33C359E84D652D1DA',
    )
  })

  it('renders tx that sets a minter', () => {
    renderComponent(mockAccountSetWithNFTokenMinter)
    expect(wrapper.find('[data-testid="minter"]')).toHaveText(
      'NFT Minter: rXMART8usFd5kABXCayoP6ZfB35b4v43t',
    )
  })
})
