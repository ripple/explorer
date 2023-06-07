import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { HistoryTab } from '../HistoryTab'
import history from './mock_data/history.json'
import Loader from '../../shared/components/Loader'
import i18n from '../../../i18n/testConfig'
import { ValidatorReport } from '../../shared/vhsTypes'

describe(`HistoryTab:`, () => {
  const createWrapper = (reports?: ValidatorReport[]) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <HistoryTab reports={reports} />
      </I18nextProvider>,
    )

  it('should render reports', () => {
    const wrapper = createWrapper(history)
    expect(wrapper.find('tbody tr').length).toEqual(8)

    const rowWithMisses = wrapper.find('tbody tr').at(3)
    expect(rowWithMisses.find('.col-date .full-date')).toHaveText(
      'Sunday, August 28, 2022',
    )
    expect(rowWithMisses.find('.col-date .abbrev-date')).toHaveText('8/28/2022')

    // Check less than 1 score
    expect(rowWithMisses.find('.col-score')).toHaveClassName('td-missed')
    expect(rowWithMisses.find('.col-score')).toHaveText('0.99829')
    expect(rowWithMisses.find('.col-missed')).toHaveClassName('td-missed')
    expect(rowWithMisses.find('.col-missed')).toHaveText('37')

    // Check incomplete output
    expect(wrapper.find('tbody tr').at(7).find('.col-score')).toHaveText(
      '0.99995*',
    )
  })

  it('should render loader', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('tbody tr').length).toEqual(1)
    expect(wrapper.find(Loader)).toExist()
  })
})
