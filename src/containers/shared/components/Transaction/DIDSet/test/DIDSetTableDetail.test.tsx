import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import DIDSet from './mock_data/DIDSet.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('DIDSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(DIDSet)
    expect(wrapper).toHaveText(
      // eslint-disable-next-line no-useless-concat -- easier to read this way
      'uri: did_example' + 'did_document: doc' + 'data: attest',
    )
    wrapper.unmount()
  })
})
