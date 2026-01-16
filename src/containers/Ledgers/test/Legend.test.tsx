import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { Legend, LEGEND_STORAGE_KEY } from '../Legend'
import i18n from '../../../i18n/testConfigEnglish'

describe(`Legend`, () => {
  const setupTest = (localStorageValue?: boolean) => {
    localStorage.removeItem(LEGEND_STORAGE_KEY)
    if (localStorageValue) {
      localStorage.setItem(
        LEGEND_STORAGE_KEY,
        JSON.stringify(localStorageValue),
      )
    }

    return render(
      <I18nextProvider i18n={i18n}>
        <Legend />
      </I18nextProvider>,
    )
  }

  it(`renders open when localStorage entry 'explorer-legend-previous-interaction' is not defined`, () => {
    const { container } = setupTest()

    expect(container.querySelectorAll('.legend-heading')).toHaveLength(2)
    expect(container.querySelectorAll('.legend-section')).toHaveLength(2)
    // TransactionActionIcon renders SVGs directly without a wrapper class
    expect(container.querySelectorAll('.legend-item svg')).toHaveLength(5)
    expect(container.querySelectorAll('.legend-category')).toHaveLength(6)
  })

  it(`renders open when localStorage entry 'explorer-legend-previous-interaction' is set to false`, () => {
    const { container } = setupTest(false)

    expect(container.querySelectorAll('.legend-heading')).toHaveLength(2)
    expect(container.querySelectorAll('.legend-section')).toHaveLength(2)
  })

  it(`renders closed when localStorage entry 'explorer-legend-previous-interaction' is set to true`, () => {
    const { container } = setupTest(true)

    expect(container.querySelector('.legend-heading')).not.toBeInTheDocument()
    expect(container.querySelector('.legend-section')).not.toBeInTheDocument()
  })

  it(`sets 'explorer-legend-previous-interaction' when the toggle is clicked`, async () => {
    const { container } = setupTest(false)

    const toggle = container.querySelector('.legend-toggle')!
    await userEvent.click(toggle)
    expect(localStorage.getItem(LEGEND_STORAGE_KEY)).toEqual('true')

    await userEvent.click(toggle)
    expect(localStorage.getItem(LEGEND_STORAGE_KEY)).toEqual('true') // keeps it true
  })
})
