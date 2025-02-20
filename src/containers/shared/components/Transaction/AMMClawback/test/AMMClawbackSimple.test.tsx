import { expectSimpleRowNotToExist, expectSimpleRowText } from '../../test'

import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMClawbackNoFlag from './mock_data/withoutFlag.json'
import mockAMMClawbackWithAmount from './mock_data/withAmount.json'
import mockAMMClawbackWithFlag from './mock_data/withFlag.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('AMMClawback: Simple', () => {
  it('renders without tfClawTwoAssets flag, only one asset should be clawed back', () => {
    const wrapper = createWrapper(mockAMMClawbackNoFlag)
    expectSimpleRowText(
      wrapper,
      'asset1',
      '$260.00 USD.rGGjMesMUrRMP8ZkLZ2cZ5agzmFwBfT4f2',
    )
    expectSimpleRowNotToExist(wrapper, 'asset2')
    expectSimpleRowText(wrapper, 'holder', 'rJk5n4egp7Th4Y4vxAMVAbf1ziuiFuVKiw')
    wrapper.unmount()
  })

  it('renders with tfClawTwoAssets flag, both asset should be clawed back', () => {
    const wrapper = createWrapper(mockAMMClawbackWithFlag)
    expectSimpleRowText(
      wrapper,
      'asset1',
      '$260.00 USD.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk',
    )
    expectSimpleRowText(
      wrapper,
      'asset2',
      '100.00 YEN.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk',
    )
    expectSimpleRowText(wrapper, 'holder', 'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN')
    wrapper.unmount()
  })

  it('renders with Amount set', () => {
    const wrapper = createWrapper(mockAMMClawbackWithAmount)
    expectSimpleRowText(
      wrapper,
      'asset1',
      '$20.00 USD.rK2Du3gUmFbg5UFFHFq9LKywVuGbqNsyyi',
    )
    wrapper.unmount()
  })
})
