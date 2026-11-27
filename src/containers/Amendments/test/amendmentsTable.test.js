import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router'
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

  it('renders a retired badge and marks retired amendments as enabled', () => {
    const { container } = renderAmendmentsTable({
      amendments: [
        {
          id: 'RETIRED_ID',
          name: 'RetiredAmendment',
          rippled_version: '1.10.0',
          retired: true,
          obsolete: false,
          date: null,
        },
      ],
    })
    const badge = container.querySelector('.name .retired.badge')
    expect(badge).not.toBeNull()
    expect(badge.textContent).toBe('retired')
    expect(container.querySelector('.name .obsolete.badge')).toBeNull()
    // Retired amendments are baked into the protocol, so they are enabled.
    expect(container.querySelector('.enabled .badge').className).toContain(
      'yes',
    )
  })

  it('renders an obsolete badge and marks obsolete amendments as not enabled', () => {
    const { container } = renderAmendmentsTable({
      amendments: [
        {
          id: 'OBSOLETE_ID',
          name: 'ObsoleteAmendment',
          rippled_version: '1.10.0',
          retired: false,
          obsolete: true,
          date: null,
        },
      ],
    })
    const badge = container.querySelector('.name .obsolete.badge')
    expect(badge).not.toBeNull()
    expect(badge.textContent).toBe('obsolete')
    expect(container.querySelector('.name .retired.badge')).toBeNull()
    // Obsolete amendments were never passed, so they are not enabled.
    expect(container.querySelector('.enabled .badge').className).toContain('no')
  })
})
