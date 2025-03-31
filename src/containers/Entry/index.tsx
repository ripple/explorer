import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import NoMatch from '../NoMatch'
import { Loader } from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import { NOT_FOUND, BAD_REQUEST, HASH256_REGEX } from '../shared/utils'
import { SimpleTab } from './SimpleTab'
import './entry.scss'
import { useAnalytics } from '../shared/analytics'
import SocketContext from '../shared/SocketContext'
import { buildPath, useRouteParams } from '../shared/routing'
import { ENTRY_ROUTE } from '../App/routes'
import { JsonView } from '../shared/components/JsonView'
import { getLedgerEntry } from '../../rippled/lib/rippled'

const ERROR_MESSAGES: Record<string, { title: string; hints: string[] }> = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'entry_not_found',
  hints: ['check_entry_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_entry_id',
  hints: ['check_entry_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

export const Entry = () => {
  const { id = '', tab = 'simple' } = useRouteParams(ENTRY_ROUTE)
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { trackException, trackScreenLoaded } = useAnalytics()

  const { isLoading, data, error, isError } = useQuery(['entry', id], () => {
    if (id === '') {
      return undefined
    }
    if (HASH256_REGEX.test(id)) {
      return getLedgerEntry(rippledSocket, id, true).catch(
        (ledgerEntryRequestError) => {
          const status = ledgerEntryRequestError.code
          trackException(
            `entry ${id} --- ${JSON.stringify(
              ledgerEntryRequestError.message,
            )}`,
          )

          return Promise.reject(status)
        },
      )
    }

    return Promise.reject(BAD_REQUEST)
  })
  const { width } = useWindowSize()

  useEffect(() => {
    trackScreenLoaded()

    return () => {
      window.scrollTo(0, 0)
    }
  }, [tab, trackScreenLoaded])

  function renderSummary() {
    const type = data?.node.LedgerEntryType
    return (
      <div className="summary">
        <div className="type">{type}</div>
        {data?.deleted_ledger_index && 'DELETED'}
        <div className="id" title={data?.index ?? id}>
          <div className="title">
            {t('id')}
            {': '}{' '}
          </div>
          {data?.index}
        </div>
      </div>
    )
  }

  function renderTabs() {
    const tabs = ['simple', 'raw']
    const mainPath = buildPath(ENTRY_ROUTE, { id })
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderEntry() {
    if (!data) return undefined

    let body

    switch (tab) {
      case 'raw':
        body = <JsonView data={data.node} />
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
  console.log(data, isError, error)

  let body

  if (isError) {
    const message = getErrorMessage(error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data?.index != null) {
    body = renderEntry()
  } else if (!id) {
    body = (
      <NoMatch
        title="entry_empty_title"
        hints={['entry_empty_hint']}
        isError={false}
      />
    )
  }
  return (
    <div className="entry">
      <Helmet title={`${t('entry_short')} ${id.substring(0, 8)}...`} />
      {isLoading && <Loader />}
      {body}
    </div>
  )
}
