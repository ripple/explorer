import { useContext, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import {
  analytics,
  ANALYTIC_TYPES,
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  NOT_FOUND,
  SERVER_ERROR,
} from '../shared/utils'
import { getLedger } from '../../rippled'
import SimpleTab from './SimpleTab'
import { HistoryTab } from './HistoryTab'
import './validator.scss'
import SocketContext from '../shared/SocketContext'
import { ValidatorReport, ValidatorSupplemented } from '../shared/vhsTypes'
import NetworkContext from '../shared/NetworkContext'

const ERROR_MESSAGES = {
  [NOT_FOUND]: {
    title: 'validator_not_found',
    hints: ['check_validator_key'],
  },
  default: {
    title: 'generic_error',
    hints: ['not_your_fault'],
  },
}

const getErrorMessage = (error: keyof typeof ERROR_MESSAGES | null) =>
  (error && ERROR_MESSAGES[error]) || ERROR_MESSAGES.default

interface Params {
  identifier?: string
  tab?: string
}

export const Validator = () => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const network = useContext(NetworkContext)
  const { path = '/' } = useRouteMatch()
  const { identifier = '', tab = 'details' } = useParams<Params>()
  const { width } = useWindowSize()

  const {
    data,
    error,
    isFetching: dataIsLoading,
  } = useQuery<ValidatorSupplemented, keyof typeof ERROR_MESSAGES | null>(
    ['fetchValidatorData', identifier],
    async () => fetchValidatorData(),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
      enabled: !!network,
    },
  )

  const { data: reports, isFetching: reportIsLoading } = useQuery(
    ['fetchValidatorReport', identifier],
    async () => fetchValidatorReport(),
    {
      refetchInterval: FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
    },
  )

  useEffect(() => {
    let short = ''
    if (data?.domain) {
      short = data.domain
    } else if (data?.master_key) {
      short = `${data.master_key.substr(0, 8)}...`
    } else if (data?.signing_key) {
      short = `${data.signing_key.substr(0, 8)}...`
    }
    document.title = `Validator ${short} | ${t('xrpl_explorer')}`
  }, [data, t])

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Validator',
      path: `/validators/:identifier/${tab}`,
    })
  }, [tab, data])

  function fetchValidatorReport(): Promise<ValidatorReport[]> {
    return axios
      .get(`${process.env.VITE_DATA_URL}/validator/${identifier}/reports`)
      .then((resp) => resp.data.reports)
      .then((vhsReports: ValidatorReport[]) => {
        const sortedValidatorReports = vhsReports.sort((a, b) =>
          a.date > b.date ? -1 : 1,
        )
        return sortedValidatorReports
      })
  }

  function fetchValidatorData() {
    const url = `${process.env.VITE_DATA_URL}/validator/${identifier}`
    return axios
      .get(url)
      .then((resp) => resp.data)
      .then((response) => {
        if (response.ledger_hash == null) {
          return getLedger(response.current_index, rippledSocket).then(
            (ledgerData) => ({
              ...response,
              ledger_hash: ledgerData.ledger_hash,
              last_ledger_time: ledgerData.close_time,
            }),
          )
        }
        return response
      })
      .catch((axiosError) => {
        const status =
          axiosError.response && axiosError.response.status
            ? axiosError.response.status
            : SERVER_ERROR
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${url} --- ${JSON.stringify(axiosError)}`,
        })
        return Promise.reject(status)
      })
  }

  function renderSummary() {
    let name = 'Unknown Validator'
    if (data?.domain) {
      name = `Validator / Domain: ${data.domain}`
    } else if (data?.master_key) {
      name = `Validator / Public Key: ${data.master_key.substr(0, 8)}...`
    } else if (data?.signing_key) {
      name = `Validator / Ephemeral Key: ${data.signing_key.substr(0, 8)}...`
    }

    let subtitle = 'UNKNOWN KEY'
    if (data?.master_key) {
      subtitle = `MASTER KEY: ${data.master_key}`
    } else if (data?.signing_key) {
      subtitle = `SIGNING KEY: ${data.signing_key}`
    }

    return (
      <div className="summary">
        <div className="type">{name}</div>
        <div className="hash" title={subtitle}>
          {subtitle}
        </div>
      </div>
    )
  }

  function renderTabs() {
    const tabs = ['details', 'history']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderValidator() {
    let body

    switch (tab) {
      case 'history':
        body = <HistoryTab reports={reports ?? []} />
        break
      default:
        body = data && <SimpleTab data={data} width={width} />
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

  const isLoading = dataIsLoading || reportIsLoading
  let body

  if (error) {
    const message = getErrorMessage(error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data?.master_key || data?.signing_key) {
    body = renderValidator()
  } else if (!isLoading) {
    body = (
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <h2>Could not load validator</h2>
      </div>
    )
  }

  return (
    <div className="validator">
      {isLoading && <Loader />}
      {body}
    </div>
  )
}
