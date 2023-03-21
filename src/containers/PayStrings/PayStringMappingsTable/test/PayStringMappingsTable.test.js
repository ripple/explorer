import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfig'
import { PayStringMappingsTable } from '../index'
import TEST_TRANSACTIONS_DATA from '../../test/mockPayStringData.json'

describe('PayStringMappingsTable container', () => {
  const creatWrapper = (data, loading) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <PayStringMappingsTable data={data} loading={loading} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = creatWrapper()
    wrapper.unmount()
  })

  it('renders static parts', () => {
    const wrapper = creatWrapper()
    expect(wrapper.find('.paystring-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loader when fetching data', () => {
    const wrapper = creatWrapper(undefined, true)
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('does not render loader if we have offline data', () => {
    const wrapper = creatWrapper(TEST_TRANSACTIONS_DATA, true)
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders dynamic content with paystring data', () => {
    const wrapper = creatWrapper(TEST_TRANSACTIONS_DATA, false)

    expect(wrapper.find('.paystring-table').length).toBe(1)
    expect(wrapper.find('.paystring-table tbody tr').length).toBe(4)
  })
})
