import i18n from '../../../../../../i18n/testConfigEnglish'
import mockAMMDelete from './mock_data/AMMDelete.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('AMMDelete: Description', () => {
  it('renders description for AMMDelete transaction', () => {
    const { container, unmount } = renderComponent(mockAMMDelete)

    expect(
      container.querySelector('[data-testid="amm-delete-description"]'),
    ).toHaveTextContent(
      'Attempted to delete the AMM for \uE900 XRP and FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9.If there were more than 512 trustlines, this only removes 512 trustlines instead.',
    )
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/token/FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )

    unmount()
  })
})
