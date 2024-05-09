import { cleanup, screen } from '@testing-library/react'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Simple } from '../Simple'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('SetRegularKey: Simple', () => {
  afterEach(cleanup)
  it('renders Simple for transaction', () => {
    renderComponent(SetRegularKey)
    expectSimpleRowLabel(screen, 'regular_key', 'regular_key')
    expectSimpleRowText(
      screen,
      'regular_key',
      'rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp',
    )
  })

  it('renders Simple for transaction that unsets key', () => {
    renderComponent(SetRegularKeyUnset)

    expectSimpleRowLabel(screen, 'unset', 'unset')
    expectSimpleRowText(screen, 'unset', 'unset_regular_key')
  })
})
