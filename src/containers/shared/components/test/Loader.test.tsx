import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfig'
import { Loader } from '../Loader'

describe('Loader', () => {
  afterEach(cleanup)
  it('renders correctly ', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Loader />
      </I18nextProvider>,
    )
    expect(screen.queryByTitle('loader')).toBeDefined()
  })
})
