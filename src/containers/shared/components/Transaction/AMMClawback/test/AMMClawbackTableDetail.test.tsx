import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import AMMClawbackNoFlag from './mock_data/withoutFlag.json'
import AMMClawbackWithFlag from './mock_data/withFlag.json'
import mockAMMClawbackWithAmount from './mock_data/withAmount.json'
import mockAMMClawbackMPT from './mock_data/withMPT.json'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('AMMClawback: TableDetail', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders without tfClawTwoAssets flag, only one asset should be clawed back', () => {
    const { container, unmount } = renderComponent(AMMClawbackNoFlag)
    expect(container).toHaveTextContent(
      'claws_back' +
        '$260.00 USD.rGGjMesMUrRMP8ZkLZ2cZ5agzmFwBfT4f2' +
        'from' +
        'rJk5n4egp7Th4Y4vxAMVAbf1ziuiFuVKiw',
    )
    unmount()
  })

  it('renders without tfClawTwoAssets flag, both assets should be clawed back', () => {
    const { container, unmount } = renderComponent(AMMClawbackWithFlag)
    expect(container).toHaveTextContent(
      'claws_back' +
        '$260.00 USD.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk' +
        'and' +
        '100.00 YEN.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk' +
        'from' +
        'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
    unmount()
  })

  it('renders with Amount set', () => {
    const { container, unmount } = renderComponent(mockAMMClawbackWithAmount)
    expect(container).toHaveTextContent(
      'claws_back' +
        '$20.00 USD.rK2Du3gUmFbg5UFFHFq9LKywVuGbqNsyyi' +
        'from' +
        'rJbLyxGA3jvwrFmiouADLHMKaBQn46SVZi',
    )
    unmount()
  })

  it('renders with MPT assets (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(mockAMMClawbackMPT)
    expect(container).toHaveTextContent(
      'claws_back' +
        '260 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F' +
        'and' +
        '100 00000ABC2E631B9DFA58324DC38CDF18934FAFFFCDF69D5F' +
        'from' +
        'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
    unmount()
  })

  it('renders with MPT assets (with ticker)', () => {
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
    const { container, unmount } = renderComponent(mockAMMClawbackMPT)
    expect(container).toHaveTextContent(
      'claws_back' + '260 XGLD' + 'and' + '100 XUSD' + 'from' + 'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
    unmount()
  })
})
