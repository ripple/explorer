import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { TableDetail } from '../TableDetail'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)

  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <TableDetail instructions={data.details.instructions} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('SetRegularKeyTable: Detail', () => {
  it('renders Simple for transaction', () => {
    const wrapper = createWrapper(SetRegularKey)

    expect(wrapper.find('.setregularkey')).toExist()
    expect(wrapper.find('.label').text()).toBe(`regular_key`)
    expect(wrapper.find('.key').text()).toBe(
      `rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp`,
    )
    wrapper.unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const wrapper = createWrapper(SetRegularKeyUnset)

    expect(wrapper.find('.unset')).toExist()
    expect(wrapper.text()).toBe(`unset_regular_key`)
    wrapper.unmount()
  })
})
