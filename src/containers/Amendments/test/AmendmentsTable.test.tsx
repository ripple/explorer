import { cleanup, render, screen, within } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { AmendmentsTable } from '../AmendmentsTable'
import amendmentsRaw from './mockAmendments.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderComponent = (
  props: { amendments: any } = { amendments: undefined },
) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <AmendmentsTable {...props} />
      </I18nextProvider>
    </Router>,
  )
afterEach(cleanup)

describe('Amendments table', () => {
  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent({ amendments: amendmentsRaw.amendments })
    expect(screen.getAllByRole('row')).toHaveLength(
      amendmentsRaw.amendments.length + 1,
    )

    // Test voting amendment row.
    const votingRow = within(screen.getAllByTitle('amendment-row')[3])
    expect(votingRow.getByTitle('version')).toHaveTextContent('1.12.0')
    expect(votingRow.getByText('1.12.0')).toHaveAttribute(
      'href',
      'https://github.com/XRPLF/rippled/releases/tag/1.12.0',
    )

    expect(votingRow.getByTitle('count')).toHaveTextContent('4')

    expect(votingRow.getByTitle('amendment-id')).toHaveTextContent(
      '56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B',
    )

    expect(votingRow.getByTitle('name')).toHaveTextContent('Clawback')
    expect(votingRow.getByText('Clawback')).toHaveAttribute(
      'href',
      '/amendment/56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B',
    )

    expect(votingRow.getByTitle('voters')).toHaveTextContent('4')

    expect(votingRow.getByTitle('enabled')).toHaveTextContent('no')

    expect(votingRow.getByTitle('on_tx')).toHaveTextContent('voting')

    // Test enabled amendment row.

    const enabledRow = within(screen.getAllByTitle('amendment-row')[1])
    expect(enabledRow.getByTitle('version')).toHaveTextContent('1.10.0')
    expect(enabledRow.getByText('1.10.0')).toHaveAttribute(
      'href',
      'https://github.com/XRPLF/rippled/releases/tag/1.10.0',
    )

    expect(enabledRow.getByTitle('count')).toHaveTextContent('2')

    expect(enabledRow.getByTitle('amendment-id')).toHaveTextContent(
      '75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A',
    )

    expect(enabledRow.getByTitle('name')).toHaveTextContent(
      'ImmediateOfferKilled',
    )
    expect(enabledRow.getByText('ImmediateOfferKilled')).toHaveAttribute(
      'href',
      '/amendment/75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A',
    )

    expect(enabledRow.getByTitle('enabled')).toHaveTextContent('yes')

    expect(enabledRow.getByTitle('on_tx')).toHaveTextContent('8/21/2023')
    expect(enabledRow.getByText('8/21/2023')).toHaveAttribute(
      'href',
      '/transactions/65B8A4068B20696A866A07E5668B2AEB0451564E13B79421356FB962EC9A536B',
    )
  })
})
