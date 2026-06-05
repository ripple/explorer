import { expectSimpleRowNotToExist, expectSimpleRowText } from '../../test'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMClawbackNoFlag from './mock_data/withoutFlag.json'
import mockAMMClawbackWithAmount from './mock_data/withAmount.json'
import mockAMMClawbackWithFlag from './mock_data/withFlag.json'
import mockAMMClawbackMPT from './mock_data/withMPT.json'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderSimple = createSimpleRenderFactory(Simple)

describe('AMMClawback: Simple', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders without tfClawTwoAssets flag, only one asset should be clawed back', () => {
    const { container } = renderSimple(mockAMMClawbackNoFlag)
    expectSimpleRowText(
      container,
      'asset1',
      '$260.00 USD.rGGjMesMUrRMP8ZkLZ2cZ5agzmFwBfT4f2',
    )
    expectSimpleRowNotToExist(container, 'asset2')
    expectSimpleRowText(
      container,
      'holder',
      'rJk5n4egp7Th4Y4vxAMVAbf1ziuiFuVKiw',
    )
  })

  it('renders with tfClawTwoAssets flag, both asset should be clawed back', () => {
    const { container } = renderSimple(mockAMMClawbackWithFlag)
    expectSimpleRowText(
      container,
      'asset1',
      '$260.00 USD.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk',
    )
    expectSimpleRowText(
      container,
      'asset2',
      '100.00 YEN.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk',
    )
    expectSimpleRowText(
      container,
      'holder',
      'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
  })

  it('renders with Amount set', () => {
    const { container } = renderSimple(mockAMMClawbackWithAmount)
    expectSimpleRowText(
      container,
      'asset1',
      '$20.00 USD.rK2Du3gUmFbg5UFFHFq9LKywVuGbqNsyyi',
    )
  })

  it('renders with MPT assets (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container } = renderSimple(mockAMMClawbackMPT)
    expectSimpleRowText(
      container,
      'asset1',
      '260 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expectSimpleRowText(
      container,
      'asset2',
      '100 00000ABC2E631B9DFA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expectSimpleRowText(
      container,
      'holder',
      'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
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
    const { container } = renderSimple(mockAMMClawbackMPT)
    expectSimpleRowText(container, 'asset1', '260 XGLD')
    expectSimpleRowText(container, 'asset2', '100 XUSD')
    expectSimpleRowText(
      container,
      'holder',
      'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
  })
})
