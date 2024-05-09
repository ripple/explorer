import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import DIDSet from './mock_data/DIDSet.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('DIDSet: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(DIDSet)
    expectSimpleRowText(screen, 'uri', 'did_example')
    expectSimpleRowText(screen, 'did_document', 'doc')
    expectSimpleRowText(screen, 'attestation', 'attest')
  })
})
