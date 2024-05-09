import { cleanup, screen } from '@testing-library/react'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { TableDetail } from '../TableDetail'
import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SetRegularKeyTable: Detail', () => {
  it('renders Simple for transaction', () => {
    renderComponent(SetRegularKey)

    expect(wrapper.find('.setregularkey')).toExist()
    expect(wrapper.find('.label').text()).toBe(`regular_key`)
    expect(wrapper.find('.key').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
  })

  it('renders Simple for transaction that unsets key', () => {
    renderComponent(SetRegularKeyUnset)

    expect(wrapper.find('.unset')).toExist()
    expect(wrapper.text()).toBe(`unset_regular_key`)
  })
})
