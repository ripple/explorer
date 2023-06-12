import React, { FC, PropsWithChildren } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { MemoryRouter, Routes } from 'react-router'
import { Route } from 'react-router-dom'
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
        <MemoryRouter initialEntries={initialEntries}>
          {React.isValidElement(children) && children?.type === Route ? (
            <Routes>{children}</Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </HelmetProvider>
    </I18nextProvider>
  </QueryClientProvider>
)
