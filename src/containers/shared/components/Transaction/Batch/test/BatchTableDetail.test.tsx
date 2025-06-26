import { createTableDetailWrapperFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { TableDetail } from '../TableDetail'
import Batch from './mock_data/Batch.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('Batch: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(Batch)
    expect(wrapper).toHaveText('Batch 3 transactions')
    wrapper.unmount()
  })
})
