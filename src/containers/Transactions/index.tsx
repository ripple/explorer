import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import NoMatch from '../NoMatch'
import { Loader } from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import {
  NOT_FOUND,
  BAD_REQUEST,
  HASH256_REGEX,
  CTID_REGEX,
} from '../shared/utils'
import { SimpleTab } from './SimpleTab'
import { DetailTab } from './DetailTab'
import './transaction.scss'
import { AnalyticsFields, useAnalytics } from '../shared/analytics'
import SocketContext from '../shared/SocketContext'
import { TxStatus } from '../shared/components/TxStatus'
import { getAction, getCategory } from '../shared/components/Transaction'
import { buildPath, useRouteParams } from '../shared/routing'
import { SUCCESSFUL_TRANSACTION } from '../shared/transactionUtils'
import { getTransaction } from '../../rippled'
import { TRANSACTION_ROUTE } from '../App/routes'
import { JsonView } from '../shared/components/JsonView'

const WRONG_NETWORK = 406

const ERROR_MESSAGES: Record<string, { title: string; hints: string[] }> = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'transaction_not_found',
  hints: ['server_ledgers_hint', 'check_transaction_hash'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_transaction_hash',
  hints: ['check_transaction_hash'],
}
ERROR_MESSAGES[WRONG_NETWORK] = {
  title: 'wrong_network',
  hints: ['check_transaction_hash'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

export const Transaction = () => {
  const { identifier = '', tab = 'simple' } = useRouteParams(TRANSACTION_ROUTE)
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { trackException, trackScreenLoaded } = useAnalytics()
  const { isLoading, data, error, isError } = useQuery(
    ['transaction', identifier],
    () => {
      if (identifier === '') {
        return undefined
      }
      if (HASH256_REGEX.test(identifier) || CTID_REGEX.test(identifier)) {
        return getTransaction(identifier, rippledSocket).catch(
          (transactionRequestError) => {
            const status = transactionRequestError.code
            trackException(
              `transaction ${identifier} --- ${JSON.stringify(
                transactionRequestError.message,
              )}`,
            )

            return Promise.reject(status)
          },
        )
      }

      return Promise.reject(BAD_REQUEST)
    },
  )
  const { width } = useWindowSize()

  useEffect(() => {
    if (!data?.processed) return

    const type = data?.processed.tx.TransactionType
    const status = data?.processed.meta.TransactionResult

    const transactionProperties: AnalyticsFields = {
      transaction_action: getAction(type),
      transaction_category: getCategory(type),
      transaction_type: type,
    }

    if (status !== SUCCESSFUL_TRANSACTION) {
      transactionProperties.tec_code = status
    }

    trackScreenLoaded(transactionProperties)
  }, [identifier, data?.processed, tab, trackScreenLoaded])

  function renderSummary() {
    const type = data?.processed.tx.TransactionType
    return (
      <div className="summary">
        <div className="type">{type}</div>
        <TxStatus status={data?.processed.meta.TransactionResult} />
        <div className="txid" title={data?.processed.hash}>
          <div className="title">{t('hash')}: </div>
          {data?.processed.hash}
        </div>
        {data?.processed.tx.ctid && (
          <div className="txid" title={data.processed.tx.ctid}>
            <div className="title">CTID: </div>
            {data.processed.tx.ctid}
          </div>
        )}
      </div>
    )
  }

  function renderTabs() {
    const tabs = ['simple', 'detailed', 'raw']
    const mainPath = buildPath(TRANSACTION_ROUTE, { identifier })
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderTransaction() {
    if (!data) return undefined

    let body

    switch (tab) {
      case 'detailed':
        body = <DetailTab data={data.processed} />
        break
      case 'raw':
        body = <JsonView data={data.raw} />
        break
      default:
        body = <SimpleTab data={data} width={width} />
        break
    }
    return (
      <>
        {renderSummary()}
        {renderTabs()}
        <div className="tab-body">{body}</div>
      </>
    )
  }

  let body

  if (isError) {
    const message = getErrorMessage(error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data?.processed && data?.processed.hash) {
    body = renderTransaction()
  } else if (!identifier) {
    body = (
      <NoMatch
        title="transaction_empty_title"
        hints={['transaction_empty_hint']}
        isError={false}
      />
    )
  }
  return (
    <div className="transaction">
      <Helmet
        title={`${t('transaction_short')} ${identifier.substring(0, 8)}...`}
      />
      {isLoading && <Loader />}
      {body}
    </div>
  )
}
