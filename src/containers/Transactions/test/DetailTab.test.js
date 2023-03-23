import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import Transaction from '../../shared/components/Transaction/EscrowCreate/test/mock_data/EscrowCreate.json'
import FailedTransaction from '../../shared/components/Transaction/SignerListSet/test/mock_data/SignerListSet.json'
import DetailTab from '../DetailTab'
import i18n from '../../../i18n/testConfigEnglish'

describe('DetailTab container', () => {
  const createWrapper = (transaction = Transaction) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <DetailTab t={i18n.t} language="en-US" data={transaction} />
        </I18nextProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.detail-body').length).toBe(1)
    expect(wrapper.contains(<div className="title">Status</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">Description</div>)).toBe(
      true,
    )
    expect(
      wrapper.contains(
        <div className="title">
          Memos
          <span>(decoded hex)</span>
        </div>,
      ),
    ).toBe(true)
    expect(
      wrapper.contains(
        <div className="title transaction-cost">Transaction Cost</div>,
      ),
    ).toBe(true)
    expect(wrapper.contains(<div className="title">Flags</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">Meta</div>)).toBe(true)
    wrapper.unmount()
  })

  it(`renders failed transaction`, () => {
    const wrapper = createWrapper(FailedTransaction)
    expect(wrapper.find(`.detail-section[data-test="status"]`).text()).toEqual(
      expect.stringContaining(
        `This transaction failed with a status code of tecINSUFFICIENT_RESERVE, and validated in ledger 37375929 on`,
      ),
    )
    expect(
      wrapper.find(`.detail-section[data-test="status"] .fail`).text(),
    ).toEqual(`tecINSUFFICIENT_RESERVE`)
    wrapper.unmount()
  })
})
