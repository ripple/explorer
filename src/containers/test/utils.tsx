import { FC, PropsWithChildren } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router'
import type i18n from '../../i18n/testConfig'
import { testQueryClient } from './QueryClient'

export function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

export const QuickHarness: FC<
  PropsWithChildren<{
    i18n: typeof i18n
    initialEntries?: string[] | undefined
  }>
> = ({ i18n: i18nConfig, children, initialEntries }) => (
  <QueryClientProvider client={testQueryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <HelmetProvider>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </HelmetProvider>
    </I18nextProvider>
  </QueryClientProvider>
)
