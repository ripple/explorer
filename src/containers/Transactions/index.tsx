import { useContext, useEffect } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import ReactJson from 'react-json-view'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
  HASH_REGEX,
} from '../shared/utils'
import { SimpleTab } from './SimpleTab'
import DetailTab from './DetailTab'
import './transaction.scss'
import SocketContext from '../shared/SocketContext'
import { TxStatus } from '../shared/components/TxStatus'
import { getTransaction } from '../../rippled'

const ERROR_MESSAGES: Record<string, { title: string; hints: string[] }> = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'transaction_not_found',
  hints: ['server_ledgers_hint', 'check_transaction_hash'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_transaction_hash',
  hints: ['check_transaction_hash'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

export const Transaction = () => {
  const { identifier = '', tab = 'simple' } = useParams<{
    identifier: string
    tab: string
  }>()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { isLoading, data, error, isError } = useQuery(
    ['transaction', identifier],
    () => {
      if (identifier === '') {
        return undefined
      }
      if (!HASH_REGEX.test(identifier)) {
        return Promise.reject(BAD_REQUEST)
      }

      return getTransaction(identifier, rippledSocket).catch(
        (transactionRequestError) => {
          const status = transactionRequestError.code
          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `transaction ${identifier} --- ${JSON.stringify(
              transactionRequestError.message,
            )}`,
          })

          return Promise.reject(status)
        },
      )
    },
  )
  const { width } = useWindowSize()

  const short = identifier.substr(0, 8)
  document.title = `${t('xrpl_explorer')} | ${t(
    'transaction_short',
  )} ${short}...`

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Transaction',
      path: `/transactions/:hash/${tab}`,
    })
  }, [identifier, data, tab])

  function renderSummary() {
    const type = data?.raw.tx.TransactionType
    return (
      <div className="summary">
        <div className="type">{type}</div>
        <TxStatus status={data?.raw.meta.TransactionResult} />
        <div className="hash" title={data?.raw.hash}>
          {data?.raw.hash}
        </div>
      </div>
    )
  }

  function renderTabs() {
    const { path = '/' } = match
    const tabs = ['simple', 'detailed', 'raw']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderTransaction() {
    if (!data) return <></>

    let body

    switch (tab) {
      case 'detailed':
        body = <DetailTab data={data.raw} />
        break
      case 'raw':
        body = (
          <ReactJson
            src={data.raw}
            collapsed={5}
            displayObjectSize={false}
            displayDataTypes={false}
            name={false}
            collapseStringsAfterLength={65}
            theme="bright"
          />
        )
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
  } else if (data?.raw && data?.raw.hash) {
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
      {isLoading && <Loader />}
      {body}
    </div>
  )
}
