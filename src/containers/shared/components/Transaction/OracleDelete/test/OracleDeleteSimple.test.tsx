import { screen, cleanup } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleDelete from './mock_data/OracleDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)
describe('OracleDelete: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(OracleDelete)
    expectSimpleRowText(screen, 'oracle-document-id', '1')
  })
})
