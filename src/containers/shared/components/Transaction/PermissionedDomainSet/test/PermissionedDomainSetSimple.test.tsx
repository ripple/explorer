import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('PermissionedDomainSetSimple: Renders', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(PermissionedDomainSet)

    expectSimpleRowText(
      container,
      'cred-type',
      '4964656E74697479446F63756D656E74',
    )
    expectSimpleRowText(
      container,
      'cred-issuer',
      'rUVQzukKnGSw4qNjEvBxLxquaLaMwzVBab',
    )

    unmount()
  })
})
