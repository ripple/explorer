import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowText } from '../../test'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMDelete from './mock_data/AMMDelete.json'
import mockAMMDeleteMPT from './mock_data/AMMDeleteMPT.json'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AMMDelete: Simple', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders', () => {
    const { container, unmount } = renderComponent(mockAMMDelete)
    expectSimpleRowText(container, 'asset1', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      'FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    unmount()
  })

  it('renders with MPT asset (no ticker - displays mpt_issuance_id)', () => {
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)
    expectSimpleRowText(container, 'asset1', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders with MPT asset (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(mockAMMDeleteMPT)
    expectSimpleRowText(container, 'asset1', '\uE900 XRP')
    expectSimpleRowText(container, 'asset2', 'XMPT')
    unmount()
  })
})
