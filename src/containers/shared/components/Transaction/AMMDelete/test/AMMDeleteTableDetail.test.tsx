import { TableDetail } from '../TableDetail'
import mockAMMDelete from './mock_data/AMMDelete.json'
import mockAMMDeleteMPT from './mock_data/AMMDeleteMPT.json'
import { createTableDetailRenderFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('AMMDelete: TableDetail', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(mockAMMDelete)

    expect(container.querySelector('[data-testid="asset"]')).toHaveTextContent(
      'Asset 1\uE900 XRP',
    )
    expect(container.querySelector('[data-testid="asset2"]')).toHaveTextContent(
      'Asset 2FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    unmount()
  })

  it('renders with MPT asset (no ticker - displays mpt_issuance_id)', () => {
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)

    expect(container.querySelector('[data-testid="asset"]')).toHaveTextContent(
      'Asset 1\uE900 XRP',
    )
    expect(container.querySelector('[data-testid="asset2"]')).toHaveTextContent(
      'Asset 2000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders with MPT asset (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)

    expect(container.querySelector('[data-testid="asset"]')).toHaveTextContent(
      'Asset 1\uE900 XRP',
    )
    expect(container.querySelector('[data-testid="asset2"]')).toHaveTextContent(
      'Asset 2XMPT',
    )
    expect(container.querySelector('[data-testid="asset2"] a')).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })
})
