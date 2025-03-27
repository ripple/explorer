import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import AMMClawbackNoFlag from './mock_data/withoutFlag.json'
import AMMClawbackWithFlag from './mock_data/withFlag.json'
import mockAMMClawbackWithAmount from './mock_data/withAmount.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('AMMClawback: TableDetail', () => {
  it('renders without tfClawTwoAssets flag, only one asset should be clawed back', () => {
    const wrapper = createWrapper(AMMClawbackNoFlag)
    expect(wrapper).toHaveText(
      'claws_back' +
        '$260.00 USD.rGGjMesMUrRMP8ZkLZ2cZ5agzmFwBfT4f2' +
        'from' +
        'rJk5n4egp7Th4Y4vxAMVAbf1ziuiFuVKiw',
    )
    wrapper.unmount()
  })

  it('renders without tfClawTwoAssets flag, both assets should be clawed back', () => {
    const wrapper = createWrapper(AMMClawbackWithFlag)
    expect(wrapper).toHaveText(
      'claws_back' +
        '$260.00 USD.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk' +
        'and' +
        '100.00 YEN.rUuVtbgagFKjHPTxmN639XYVHLATnB6VNk' +
        'from' +
        'r4eWC5DixP74dpk7FDzXcap1BJ2NaoUeZN',
    )
    wrapper.unmount()
  })

  it('renders with Amount set', () => {
    const wrapper = createWrapper(mockAMMClawbackWithAmount)
    expect(wrapper).toHaveText(
      'claws_back' +
        '$20.00 USD.rK2Du3gUmFbg5UFFHFq9LKywVuGbqNsyyi' +
        'from' +
        'rJbLyxGA3jvwrFmiouADLHMKaBQn46SVZi',
    )
    wrapper.unmount()
  })
})
