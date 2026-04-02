import { isValidElement, FC, PropsWithChildren } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { MemoryRouter, Routes, Route } from 'react-router'
import type i18n from '../../i18n/testConfig'
import { testQueryClient } from './QueryClient'
import { AnalyticsSetPath } from '../shared/analytics'
import { TooltipProvider } from '../shared/components/Tooltip'

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}

// @ts-ignore
Helmet.defaultProps.defer = false

export const QuickHarness: FC<
  PropsWithChildren<{
    i18n: typeof i18n
    initialEntries?: string[] | undefined
  }>
> = ({ i18n: i18nConfig, children, initialEntries }) => (
  <QueryClientProvider client={testQueryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <HelmetProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <AnalyticsSetPath />
            {isValidElement(children) && children?.type === Route ? (
              <Routes>{children}</Routes>
            ) : (
              children
            )}
          </MemoryRouter>
        </TooltipProvider>
      </HelmetProvider>
    </I18nextProvider>
  </QueryClientProvider>
)
