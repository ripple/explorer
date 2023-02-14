import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Legend, LEGEND_STORAGE_KEY } from '../Legend'
import { TransactionActionIcon } from '../../shared/components/TransactionActionIcon/TransactionActionIcon'
import i18n from '../../../i18nTestConfig.en-US'

describe(`Legend`, () => {
  const setupTest = (localStorageValue?: boolean) => {
    localStorage.removeItem(LEGEND_STORAGE_KEY)
    if (localStorageValue) {
      localStorage.setItem(
        LEGEND_STORAGE_KEY,
        JSON.stringify(localStorageValue),
      )
    }

    return mount(
      <I18nextProvider i18n={i18n}>
        <Legend />
      </I18nextProvider>,
    )
  }

  it(`renders open when localStorage entry 'explorer-legend-previous-interaction' is not defined`, () => {
    const wrapper = setupTest()

    expect(wrapper.find('.legend-heading')).toHaveLength(2)
    expect(wrapper.find('.legend-section')).toHaveLength(2)
    expect(wrapper.find(TransactionActionIcon)).toHaveLength(5)
    expect(wrapper.find('.legend-category')).toHaveLength(6) // XChain is hidden for now
    wrapper.unmount()
  })
  it(`renders open when localStorage entry 'explorer-legend-previous-interaction' is set to false`, () => {
    const wrapper = setupTest(false)

    expect(wrapper.find('.legend-heading')).toHaveLength(2)
    expect(wrapper.find('.legend-section')).toHaveLength(2)
    wrapper.unmount()
  })

  it(`renders closed when localStorage entry 'explorer-legend-previous-interaction' is set to true`, () => {
    const wrapper = setupTest(true)

    expect(wrapper.find('.legend-heading')).not.toExist()
    expect(wrapper.find('.legend-section')).not.toExist()
  })

  it(`sets 'explorer-legend-previous-interaction' when the toggle is clicked`, () => {
    const wrapper = setupTest(false)

    wrapper.find('.legend-toggle').simulate('click')
    expect(localStorage.getItem(LEGEND_STORAGE_KEY)).toEqual('true')

    wrapper.find('.legend-toggle').simulate('click')
    expect(localStorage.getItem(LEGEND_STORAGE_KEY)).toEqual('true') // keeps it true
    wrapper.unmount()
  })
})
