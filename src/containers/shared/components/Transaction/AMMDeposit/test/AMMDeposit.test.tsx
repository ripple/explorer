import { Simple } from '../Simple'
import {
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'
import depositBothAssets from './mock_data/deposit_both.json'
import depositUSD from './mock_data/deposit_usd.json'
import depositXRP from './mock_data/deposit_xrp.json'
import depositEprice from './mock_data/deposit_eprice.json'
import depositNonXRP from './mock_data/deposit_nonxrp.json'
import depositFail from './mock_data/deposit_fail.json'
import depositLPToken from './mock_data/deposit_lptoken.json'
import depositMPT from './mock_data/deposit_mpt.json'
import depositBothMPT from './mock_data/deposit_both_mpt.json'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

describe('AMM Deposit Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders with both assets', () => {
    const { container, unmount } = renderComponent(depositBothAssets)
    expectSimpleRowText(container, 'asset1', '\uE90010,997.290462 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders only with USD', () => {
    const { container, unmount } = renderComponent(depositUSD)
    expectSimpleRowNotToExist(container, 'asset1')
    expectSimpleRowText(
      container,
      'asset2',
      '$2,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders only with XRP', () => {
    const { container, unmount } = renderComponent(depositXRP)
    expectSimpleRowText(container, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders with eprice', () => {
    const { container, unmount } = renderComponent(depositEprice)
    expectSimpleRowNotToExist(container, 'asset1')
    expectSimpleRowText(
      container,
      'asset2',
      '$1,000.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      container,
      'effective_price',
      '$0.10 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    unmount()
  })

  it('renders with both assets non XRP', () => {
    const { container, unmount } = renderComponent(depositNonXRP)
    expectSimpleRowText(
      container,
      'asset1',
      '€500.00 EUR.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      container,
      'asset2',
      '$500.00 USD.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rEJ1X5BoSmHqa5h6TSVvYrHAzFmyxGqNic',
    )
    unmount()
  })

  it('deposit shouldnt crash with tx that changes fee', () => {
    const { container, unmount } = renderComponent(depositFail)
    expectSimpleRowNotToExist(container, 'asset1')
    expectSimpleRowNotToExist(container, 'asset2')
    expectSimpleRowNotToExist(container, 'account_id')
    unmount()
  })

  it('renders LP Tokens properly', () => {
    const { container, unmount } = renderComponent(depositLPToken)
    expectSimpleRowText(container, 'lp_tokens', '4,279,342.4')
    unmount()
  })

  it('renders with MPT asset (no ticker - displays mpt_issuance_id)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(depositMPT)
    expectSimpleRowText(container, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      '10,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders with MPT asset (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(depositMPT)
    expectSimpleRowText(container, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(container, 'asset2', '10,000 XMPT')
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders with both assets as MPT (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(depositBothMPT)
    expectSimpleRowText(
      container,
      'asset1',
      '5,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expectSimpleRowText(
      container,
      'asset2',
      '2,000 00000ABC2E631B9DFA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders with both assets as MPT (with ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockImplementation((mptID: string) => {
      if (mptID === '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F') {
        return {
          data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XGLD' } },
        }
      }
      return {
        data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XUSD' } },
      }
    })
    const { container, unmount } = renderComponent(depositBothMPT)
    expectSimpleRowText(container, 'asset1', '5,000 XGLD')
    expectSimpleRowText(container, 'asset2', '2,000 XUSD')
    unmount()
  })
})
