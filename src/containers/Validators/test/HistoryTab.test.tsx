import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { HistoryTab } from '../HistoryTab'
import history from './mock_data/history.json'
import i18n from '../../../i18n/testConfig'
import { ValidatorReport } from '../../shared/vhsTypes'

describe(`HistoryTab:`, () => {
  const renderHistoryTab = (reports?: ValidatorReport[]) =>
    render(
      <I18nextProvider i18n={i18n}>
        <HistoryTab reports={reports} />
      </I18nextProvider>,
    )

  it('should render reports', () => {
    const { container } = renderHistoryTab(history)
    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(8)

    const rowWithMisses = rows[3]
    expect(
      rowWithMisses.querySelector('.col-date .full-date'),
    ).toHaveTextContent('Sunday, August 28, 2022')
    expect(
      rowWithMisses.querySelector('.col-date .abbrev-date'),
    ).toHaveTextContent('8/28/2022')

    // Check less than 1 score
    expect(rowWithMisses.querySelector('.col-score')).toHaveClass('td-missed')
    expect(rowWithMisses.querySelector('.col-score')).toHaveTextContent(
      '0.99829',
    )
    expect(rowWithMisses.querySelector('.col-missed')).toHaveClass('td-missed')
    expect(rowWithMisses.querySelector('.col-missed')).toHaveTextContent('37')

    // Check incomplete output
    expect(rows[7].querySelector('.col-score')).toHaveTextContent('0.99995*')
  })

  it('should render loader', () => {
    const { container } = renderHistoryTab()
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })
})
