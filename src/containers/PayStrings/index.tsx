import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router'
import { useQuery } from 'react-query'

import { useAnalytics } from '../shared/analytics'
import { PayStringHeader } from './PayStringHeader'
import { PayStringMappingsTable } from './PayStringMappingsTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import { getPayString } from '../../rippled'

export const PayString = () => {
  const { id: accountId = '' } = useParams<{ id: string }>()
  const { trackException, trackScreenLoaded } = useAnalytics()

  const { data, isError, isLoading } = useQuery(['paystring', accountId], () =>
    getPayString(accountId).catch((transactionRequestError) => {
      const status = transactionRequestError.code

      trackException(
        `PayString ${accountId} --- ${JSON.stringify(transactionRequestError)}`,
      )
      return Promise.reject(status)
    }),
  )

  useEffect(() => {
    trackScreenLoaded()

    return () => {
      window.scrollTo(0, 0)
    }
  }, [accountId, trackScreenLoaded])

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
