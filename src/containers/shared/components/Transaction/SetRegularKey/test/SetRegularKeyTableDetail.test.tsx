import { cleanup } from '@testing-library/react'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { TableDetail } from '../TableDetail'
import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SetRegularKeyTable: TableDetail', () => {
  afterEach(cleanup)
  it('renders Simple for transaction', () => {
    const { container } = renderComponent(SetRegularKey)

    expect(container).toHaveTextContent(`rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`)
  })

  it('renders Simple for transaction that unsets key', () => {
    const { container } = renderComponent(SetRegularKeyUnset)

    expect(container).toHaveTextContent(`unset_regular_key`)
  })
})
