import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import Transaction from './mock_data/EscrowCreate.json'
import DetailTab from '../DetailTab'

describe('DetailTab container', () => {
  const createWrapper = (width = 1200) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <DetailTab
            t={(s) => s}
            language="en-US"
            data={Transaction}
            width={width}
          />
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
    expect(wrapper.contains(<div className="title">status</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">description</div>)).toBe(
      true,
    )
    expect(
      wrapper.contains(
        <div className="title">
          memos
          <span>(decoded_hex)</span>
        </div>,
      ),
    ).toBe(true)
    expect(
      wrapper.contains(
        <div className="title transaction-cost">transaction_cost</div>,
      ),
    ).toBe(true)
    expect(wrapper.contains(<div className="title">flags</div>)).toBe(true)
    expect(wrapper.contains(<div className="title">meta</div>)).toBe(true)
    wrapper.unmount()
  })
})
