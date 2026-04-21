import OfferCreate from './mock_data/OfferCreateWithExpirationAndCancel.json'
import OfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import OfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import mockOfferCreateMPT from './mock_data/OfferCreateMPT.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createDescriptionRenderFactory(Description)

describe('OfferCreate: Description', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders description for transaction with cancel and expiration', () => {
    const { container, unmount } = renderComponent(OfferCreate)

    expect(container.innerHTML).toBe(
      '<div>The account<a data-testid="account" title="rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe" class="account" href="/accounts/rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe">rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">1,080,661.95882</span> <a data-testid="currency" class="currency" href="/token/CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr">CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr</a></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">1,764.293151</span> <span class="currency" data-testid="currency">XRP</span></span></b></div><div>offer_create_desc_line_2<b><span> 612.52</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr">CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr</a></small></b></div><div>offer_create_desc_line_3<b> 44866443</b></div>The offer expires<span class="time">May 18, 2022 at 5:28:16 PM UTC</span>unless cancelled before',
    )
    unmount()
  })

  it('renders description for transaction with inverted currencies', () => {
    const { container, unmount } = renderComponent(
      OfferCreateInvertedCurrencies,
    )

    expect(container.innerHTML).toBe(
      '<div>The account<a data-testid="account" title="rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG" class="account" href="/accounts/rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG">rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">17,588.363594</span> <span class="currency" data-testid="currency">XRP</span></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">$6,101.33033905</span> <a data-testid="currency" class="currency" href="/token/USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B">USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B</a></span></b></div><div>offer_create_desc_line_2<b><span> 0.34690</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B">USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B</a></small></b></div><div>offer_create_desc_line_3<b> 80543309</b></div>',
    )
    unmount()
  })

  it('renders description for transaction with Permissioned Domain ID', () => {
    const { container, unmount } = renderComponent(
      OfferCreateWithPermissionedDomainID,
    )

    expect(container.innerHTML).toBe(
      '<div>The account<a data-testid="account" title="rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds" class="account" href="/accounts/rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds">rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">17,588.363594</span> <span class="currency" data-testid="currency">XRP</span></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">$10.00</span> <a data-testid="currency" class="currency" href="/token/USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC">USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC</a></span></b></div><div>offer_create_desc_line_2<b><span> 0.00056856</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC">USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC</a></small></b></div><div>offer_create_desc_line_5<b>: 4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812</b></div>',
    )
    unmount()
  })

  it('renders OfferCreate with MPT (no ticker - displays mpt_issuance_id)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(mockOfferCreateMPT)
    const currencies = container.querySelectorAll('[data-testid="currency"]')
    const mptCurrencies = Array.from(currencies).filter((el) =>
      el.getAttribute('href')?.includes('/mpt/'),
    )

    // MPT should display full mpt_issuance_id when no ticker is available
    expect(mptCurrencies[0]).toHaveTextContent(
      '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    // Links should point to the MPT page
    expect(mptCurrencies[0]).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders OfferCreate with MPT (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(mockOfferCreateMPT)
    const currencies = container.querySelectorAll('[data-testid="currency"]')
    const mptCurrencies = Array.from(currencies).filter((el) =>
      el.getAttribute('href')?.includes('/mpt/'),
    )

    // MPT should display ticker symbol when available
    expect(mptCurrencies[0]).toHaveTextContent('XMPT')
    // Links should still point to the MPT page using the full ID
    expect(mptCurrencies[0]).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })
})
