import { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { i18n } from 'i18next'
import { QueryClientProvider } from 'react-query'
import { render } from '@testing-library/react'
import defaultI18nConfig from '../../../../../i18n/testConfig'
import summarizeTransaction from '../../../../../rippled/lib/txSummary'
import {
  TransactionDescriptionComponent,
  TransactionSimpleComponent,
  TransactionTableDetailComponent,
} from '../types'
import { testQueryClient } from '../../../../test/QueryClient'

/**
 * Methods that produce createWrapper function for tests
 * @param TestComponent - react component to test
 * @param i18nConfig - i18next configuration to use instead of the default which outputs the key as the value
 */

export function renderComponent(
  TestComponent: ReactElement,
  i18nConfig?: i18n,
): void {
  render(
    <QueryClientProvider client={testQueryClient}>
      <I18nextProvider i18n={i18nConfig || defaultI18nConfig}>
        <BrowserRouter>{TestComponent}</BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  )
}

export function createDescriptionRenderFactory(
  Description: TransactionDescriptionComponent,
  i18nConfig?: i18n,
): (tx: any) => void {
  return function createDescriptionWrapper(tx: any) {
    renderComponent(<Description data={tx} />, i18nConfig)
  }
}

export function createSimpleRenderFactory(
  Simple: TransactionSimpleComponent,
  i18nConfig?: i18n,
): (tx: any) => void {
  return function createSimpleWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)
    renderComponent(<Simple data={data.details!} />, i18nConfig)
  }
}

export function createTableDetailRenderFactory(
  TableDetail: TransactionTableDetailComponent,
  i18nConfig?: i18n,
): (tx: any) => void {
  return function createTableDetailWrapper(tx: any) {
    const data = summarizeTransaction(tx, true)

    renderComponent(
      <TableDetail instructions={data.details!.instructions} />,
      i18nConfig,
    )
  }
}
