import i18n from '../../../../../../i18n/testConfigEnglish'
import mockAMMDelete from './mock_data/AMMDelete.json'
import mockAMMDeleteMPT from './mock_data/AMMDeleteMPT.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('AMMDelete: Description', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders description for AMMDelete transaction', () => {
    const { container, unmount } = renderComponent(mockAMMDelete)

    expect(
      container.querySelector('[data-testid="amm-delete-description"]'),
    ).toHaveTextContent(
      'Attempted to delete the AMM for \uE900 XRP and FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9.If there were more than 512 trustlines, this only removes 512 trustlines instead.',
    )
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/token/FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )

    unmount()
  })

  it('renders with MPT asset (no ticker - displays mpt_issuance_id)', () => {
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)

    expect(
      container.querySelector('[data-testid="amm-delete-description"]'),
    ).toHaveTextContent(
      'Attempted to delete the AMM for \uE900 XRP and 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F.',
    )
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders with MPT asset (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)

    expect(
      container.querySelector('[data-testid="amm-delete-description"]'),
    ).toHaveTextContent(
      'Attempted to delete the AMM for \uE900 XRP and XMPT.',
    )
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })
})
