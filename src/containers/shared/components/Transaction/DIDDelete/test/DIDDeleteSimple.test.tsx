import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import DIDDelete from './mock_data/DIDDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('DIDDelete: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(DIDDelete)
  })
})
