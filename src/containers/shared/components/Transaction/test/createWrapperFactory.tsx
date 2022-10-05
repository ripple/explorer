import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import i18n from '../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../rippled/lib/txSummary'
import {
  TransactionDescriptionComponent,
  TransactionSimpleComponent,
  TransactionTableDetailComponent,
} from '../types'

export function createWrapper(TestComponent: React.ReactElement): ReactWrapper {
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{TestComponent}</BrowserRouter>
    </I18nextProvider>,
  )
}

export function createDescriptionWrapperFactory(
  Description: TransactionDescriptionComponent,
): (tx: any) => ReactWrapper {
  return function createDescriptionWrapper(tx: any) {
    return createWrapper(<Description data={tx} />)
  }
}

export function createSimpleWrapperFactory(
  Simple: TransactionSimpleComponent,
): (tx: any) => ReactWrapper {
  return function createSimpleWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)
    return createWrapper(<Simple data={data.details!} />)
  }
}

export function createTableDetailWrapperFactory(
  TableDetail: TransactionTableDetailComponent,
): (tx: any) => ReactWrapper {
  return function createTableDetailWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)

    return createWrapper(
      <TableDetail instructions={data.details!.instructions} />,
    )
  }
}
