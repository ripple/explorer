import { expectSimpleRowNotToExist, expectSimpleRowText } from '../../test'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMClawbackNoFlag from './mock_data/withoutFlag.json'
import mockAMMClawbackWithAmount from './mock_data/withAmount.json'
import mockAMMClawbackWithFlag from './mock_data/withFlag.json'

const renderSimple = createSimpleRenderFactory(Simple)

describe('AMMClawback: Simple', () => {
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
})
