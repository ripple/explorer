import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import {
  analytics,
  ANALYTIC_TYPES,
  FETCH_INTERVAL_VHS_MILLIS,
  NOT_FOUND,
  SERVER_ERROR,
} from '../shared/utils'
import { getLedger } from '../../rippled'
import SimpleTab from './SimpleTab'
import { HistoryTab } from './HistoryTab'
import './validator.scss'
import SocketContext from '../shared/SocketContext'

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

interface Props {
  match: {
    path?: string
    params: {
      identifier?: string
      tab?: string
    }
  }
}

interface ValidatorData {
  domain?: string
  // eslint-disable-next-line camelcase -- from VHS
  master_key?: string
  // eslint-disable-next-line camelcase -- from VHS
  signing_key?: string
}

const Validator = (props: Props) => {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState<ValidatorData>({})
  const [width, setWidth] = useState(0)
  const ref = useRef<any>(null)
  const { t, i18n } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { match } = props
  const { identifier = '', tab = 'details' } = match.params
  const { language } = i18n

  let short = ''
  if (data.domain) {
    short = data.domain
  } else if (data.master_key) {
    short = `${data.master_key.substr(0, 8)}...`
  } else if (data.signing_key) {
    short = `${data.signing_key.substr(0, 8)}...`
  }
  document.title = `Validator ${short} | ${t('xrpl_explorer')}`

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Validator',
      path: `/validators/:identifier/${tab}`,
    })
  }, [tab])

  // TODO: move width calculation to SimpleTab once that's using hooks
  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- actually needed here, not sure why it's complaining
  }, [ref.current])

  function fetchValidatorReport() {
    axios
      .get(`${process.env.REACT_APP_DATA_URL}/validator/${identifier}/reports`)
      .then((resp) => resp.data.reports)
      .then((vhsReports) => {
        const sortedValidatorReports = vhsReports.sort((a: any, b: any) =>
          a.date > b.date ? -1 : 1,
        )
        setReports(sortedValidatorReports)
      })
  }

  function fetchValidatorData() {
    if (
      identifier &&
      identifier !== data.master_key &&
      identifier !== data.signing_key
    ) {
      const url = `${process.env.REACT_APP_DATA_URL}/validator/${identifier}`
      axios
        .get(url)
        .then((resp) => resp.data)
        .then((response) => {
          if (!response.ledger_hash) {
            getLedger(response.current_index, rippledSocket).then(
              (ledgerData) => {
                setData({
                  ...response,
                  ledger_hash: ledgerData.ledger_hash,
                  last_ledger_time: ledgerData.close_time,
                })
                setIsLoading(false)
              },
            )
          } else {
            setData(response)
            setIsLoading(false)
          }
        })
        .catch((axiosError) => {
          const status =
            axiosError.response && axiosError.response.status
              ? axiosError.response.status
              : SERVER_ERROR
          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `${url} --- ${JSON.stringify(axiosError)}`,
          })
          setError(status)
        })
    }
  }

  useQuery(['fetchValidatorData'], async () => fetchValidatorData(), {
    refetchInterval: FETCH_INTERVAL_VHS_MILLIS,
    refetchOnMount: true,
  })

  useQuery(['fetchValidatorReport'], async () => fetchValidatorReport(), {
    refetchInterval: FETCH_INTERVAL_VHS_MILLIS,
    refetchOnMount: true,
  })

  function renderSummary() {
    let name = 'Unknown Validator'
    if (data.domain) {
      name = `Validator / Domain: ${data.domain}`
    } else if (data.master_key) {
      name = `Validator / Public Key: ${data.master_key.substr(0, 8)}...`
    } else if (data.signing_key) {
      name = `Validator / Ephemeral Key: ${data.signing_key.substr(0, 8)}...`
    }

    let subtitle = 'UNKNOWN KEY'
    if (data.master_key) {
      subtitle = `MASTER KEY: ${data.master_key}`
    } else if (data.signing_key) {
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
    const { path = '/' } = match
    const tabs = ['details', 'history']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderValidator() {
    let body

    switch (tab) {
      case 'history':
        body = <HistoryTab reports={reports} />
        break
      default:
        body = <SimpleTab language={language} t={t} data={data} width={width} />
        break
    }

    return (
      <>
        {renderSummary()}
        {renderTabs()}
        <div ref={ref} className="tab-body">
          {body}
        </div>
      </>
    )
  }

  const loader = isLoading ? <Loader className="show" /> : <Loader />
  let body

  if (error) {
    const message = getErrorMessage(error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data.master_key || data.signing_key) {
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
      {loader}
      {body}
    </div>
  )
}

export default Validator
