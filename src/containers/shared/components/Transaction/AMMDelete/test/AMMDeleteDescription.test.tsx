import i18n from '../../../../../../i18n/testConfigEnglish'
import mockAMMDelete from './mock_data/AMMDelete.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('AMMDelete: Description', () => {
  it('renders description for AMMDelete transaction', () => {
    const wrapper = createWrapper(mockAMMDelete)

    expect(wrapper.find('[data-testid="amm-delete-description"]')).toHaveText(
      'Attempted to delete the AMM for \uE900 XRP and FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9.If there were more than 512 trustlines, this only removes 512 trustlines instead.',
    )
    expect(wrapper.find('a')).toHaveProp(
      'href',
      '/token/FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )

    wrapper.unmount()
  })
})
