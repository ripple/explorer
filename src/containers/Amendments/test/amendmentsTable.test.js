import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { AmendmentsTable } from '../AmendmentsTable'
import amendmentsRaw from './mockAmendments.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderAmendmentsTable = (props = {}) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <AmendmentsTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Amendments table', () => {
  it('renders without crashing', () => {
    renderAmendmentsTable()
  })

  it('renders all parts', () => {
    const { container } = renderAmendmentsTable({
      amendments: amendmentsRaw.amendments,
    })
    expect(container.querySelectorAll('tr').length).toBe(
      amendmentsRaw.amendments.length + 1,
    )
  })
})
