import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfig'
import { Loader } from '../Loader'

describe('Loader', () => {
  it('renders correctly ', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <Loader />
      </I18nextProvider>,
    )
    expect(container.querySelectorAll('.loader')).toHaveLength(1)
  })
})
