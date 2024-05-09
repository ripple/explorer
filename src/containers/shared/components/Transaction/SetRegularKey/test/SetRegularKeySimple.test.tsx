import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Simple } from '../Simple'
import { SimpleRow } from '../../SimpleRow'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const createWrapper = createSimpleRenderFactory(Simple)

describe('SetRegularKey: Simple', () => {
  it('renders Simple for transaction', () => {
    const wrapper = createWrapper(SetRegularKey)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe(`regular_key`)
    expect(keyRow.find('.value').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
    wrapper.unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const wrapper = createWrapper(SetRegularKeyUnset)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe('')
    expect(keyRow.find('.unset').hostNodes().text()).toBe(`unset_regular_key`)
    wrapper.unmount()
  })
})
