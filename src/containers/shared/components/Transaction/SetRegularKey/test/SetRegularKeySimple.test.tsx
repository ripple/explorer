import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Simple } from '../Simple'
import { SimpleRow } from '../../SimpleRow'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)

  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Simple data={data.details} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('SetRegularKey: Simple', () => {
  it('renders Simple for transaction', () => {
    const wrapper = createWrapper(SetRegularKey)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe(`regular_key`)
    expect(keyRow.find('.value').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
    wrapper.unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const wrapper = createWrapper(SetRegularKeyUnset)
    const keyRow = wrapper.find(SimpleRow)

    expect(keyRow.prop('label')).toBe(null)
    expect(keyRow.find('.unset').hostNodes().text()).toBe(`unset_regular_key`)
    wrapper.unmount()
  })
})
