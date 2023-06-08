import { useEffect } from 'react'
import { useParams } from 'react-router'

import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import { PayStringHeader } from './PayStringHeader'
import { PayStringMappingsTable } from './PayStringMappingsTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import { getPayString } from '../../rippled'

export function PayString() {
  const { id: accountId = '' } = useParams<{ id: string }>()

  const { data, isError, isLoading } = useQuery(['paystring', accountId], () =>
    getPayString(accountId).catch((transactionRequestError) => {
      const status = transactionRequestError.code

      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `PayString ${accountId} --- ${JSON.stringify(
          transactionRequestError,
        )}`,
      })
      return Promise.reject(status)
    }),
  )

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'PayStrings',
      path: '/paystrings',
    })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  const renderError = () => (
    <div className="paystring-page">
      <NoMatch title="resolve_paystring_failed" hints={['not_your_fault']} />
    </div>
  )

  return isError ? (
    renderError()
  ) : (
    <div className="paystring-page">
      <Helmet
        title={`${accountId.substring(0, 24)} ${
          accountId.length > 24 ? '...' : ''
        }`}
      />
      {accountId && <PayStringHeader accountId={accountId} />}
      {accountId && <PayStringMappingsTable data={data} loading={isLoading} />}
      {!accountId && (
        <NoMatch
          title="paystring_empty_title"
          hints={['paystring_empty_hint']}
          isError={false}
        />
      )}
    </div>
  )
}
