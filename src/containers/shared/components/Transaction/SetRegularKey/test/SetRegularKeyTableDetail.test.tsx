import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { TableDetail } from '../TableDetail'
import { createTableDetailRenderFactory } from '../../test'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('SetRegularKeyTable: Detail', () => {
  it('renders Simple for transaction', () => {
    const wrapper = createWrapper(SetRegularKey)

    expect(wrapper.find('.setregularkey')).toExist()
    expect(wrapper.find('.label').text()).toBe(`regular_key`)
    expect(wrapper.find('.key').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
    wrapper.unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const wrapper = createWrapper(SetRegularKeyUnset)

    expect(wrapper.find('.unset')).toExist()
    expect(wrapper.text()).toBe(`unset_regular_key`)
    wrapper.unmount()
  })
})
