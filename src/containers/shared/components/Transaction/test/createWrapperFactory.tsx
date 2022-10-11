import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { i18n } from 'i18next'
import defaultI18nConfig from '../../../../../i18nTestConfig'
import summarizeTransaction from '../../../../../rippled/lib/txSummary'
import {
  TransactionDescriptionComponent,
  TransactionSimpleComponent,
  TransactionTableDetailComponent,
} from '../types'

/**
 * Methods that produce createWrapper function for tests
 * @param TestComponent - react component to test
 * @param i18nConfig - i18next configuration to use instead of the default which outputs the key as the value
 */

export function createWrapper(
  TestComponent: React.ReactElement,
  i18nConfig?: i18n,
): ReactWrapper {
  return mount(
    <I18nextProvider i18n={i18nConfig || defaultI18nConfig}>
      <BrowserRouter>{TestComponent}</BrowserRouter>
    </I18nextProvider>,
  )
}

export function createDescriptionWrapperFactory(
  Description: TransactionDescriptionComponent,
  i18nConfig?: i18n,
): (tx: any) => ReactWrapper {
  return function createDescriptionWrapper(tx: any) {
    return createWrapper(<Description data={tx} />, i18nConfig)
  }
}

export function createSimpleWrapperFactory(
  Simple: TransactionSimpleComponent,
  i18nConfig?: i18n,
): (tx: any) => ReactWrapper {
  return function createSimpleWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)
    return createWrapper(<Simple data={data.details!} />, i18nConfig)
  }
}

export function createTableDetailWrapperFactory(
  TableDetail: TransactionTableDetailComponent,
  i18nConfig?: i18n,
): (tx: any) => ReactWrapper {
  return function createTableDetailWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)

    return createWrapper(
      <TableDetail instructions={data.details!.instructions} />,
      i18nConfig,
    )
  }
}
