import { cleanup, screen } from '@testing-library/react'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Simple } from '../Simple'
import { SimpleRow } from '../../SimpleRow'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('SetRegularKey: Simple', () => {
  afterEach(cleanup)
  it('renders Simple for transaction', () => {
    renderComponent(SetRegularKey)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe(`regular_key`)
    expect(keyRow.find('.value').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
  })

  it('renders Simple for transaction that unsets key', () => {
    renderComponent(SetRegularKeyUnset)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe('')
    expect(keyRow.find('.unset').hostNodes().text()).toBe(`unset_regular_key`)
  })
})
