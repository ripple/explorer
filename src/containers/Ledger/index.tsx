import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'
import {
  localizeDate,
  localizeNumber,
  formatPrice,
  NOT_FOUND,
  BAD_REQUEST,
  analytics,
  ANALYTIC_TYPES,
} from '../shared/utils'

import LeftArrow from '../shared/images/ic_left_arrow.svg'
import RightArrow from '../shared/images/ic_right_arrow.svg'
import { loadLedger } from './actions'
import { LedgerTransactionTable } from './LedgerTransactionTable'

import './ledger.scss'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

const ERROR_MESSAGES: any = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'ledger_not_found',
  hints: ['check_ledger_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_ledger_id',
  hints: ['check_ledger_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

export interface LedgerProps {
  actions: {
    loadLedger: Function
  }
  data: any
  loading: boolean
}

const Ledger = ({ actions, data, loading }: LedgerProps) => {
  const rippledSocket = useContext(SocketContext)
  const { identifier = '' } = useParams<{ identifier: string }>()
  const { t } = useTranslation()
  const language = useLanguage()

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${t('ledger')} ${identifier}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Ledger',
      path: '/ledgers/:id',
    })
    if (Number(identifier) !== data.ledger_index) {
      actions.loadLedger(identifier, rippledSocket)
    }
  }, [])

  useEffect(() => {
    actions.loadLedger(identifier, rippledSocket)
  }, [identifier])

  const renderNav = () => {
    const { ledger_index: LedgerIndex, ledger_hash: LedgerHash } = data
    const previousIndex = LedgerIndex - 1
    const nextIndex = LedgerIndex + 1
    const date = new Date(data.close_time)
    return (
      <div className="ledger-header">
        <div className="ledger-nav">
          <Link to={`/ledgers/${previousIndex}`}>
            <div className="previous">
              <LeftArrow alt="previous ledger" />
              {previousIndex}
            </div>
          </Link>
          <Link to={`/ledgers/${nextIndex}`}>
            <div className="next">
              {nextIndex}
              <RightArrow alt="next ledger" />
            </div>
          </Link>
          <div className="clear" />
        </div>
        <div className="ledger-info">
          <div className="summary">
            <div className="ledger-cols">
              <div className="ledger-col ledger-index">
                <div className="title">{t('ledger_index')}</div>
                <div className="value">{LedgerIndex}</div>
              </div>
              <div className="ledger-col">
                <div className="title">{t('total_transactions')}</div>
                <div className="value">
                  {localizeNumber(data.transactions.length, language)}
                </div>
              </div>
              <div className="ledger-col">
                <div className="title">{t('total_fees')}</div>
                <div className="value">
                  {formatPrice(data.total_fees, {
                    lang: language,
                    currency: 'XRP',
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="ledger-hash">{LedgerHash}</div>
          <div className="closed-date">
            {localizeDate(date, language, DATE_OPTIONS)} {TIME_ZONE}
          </div>
        </div>
      </div>
    )
  }

  const renderLedger = () =>
    data.ledger_hash ? (
      <>
        {renderNav()}
        <LedgerTransactionTable
          transactions={data.transactions}
          loading={loading}
        />
      </>
    ) : null

  const renderError = () => {
    if (!data.error) {
      return null
    }

    const message = getErrorMessage(data.error)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  return (
    <div className="ledger-page">
      {loading && <Loader />}
      {renderLedger()}
      {renderError()}
    </div>
  )
}

export default connect(
  (state: any) => ({
    loading: state.ledger.loading,
    data: state.ledger.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadLedger,
      },
      dispatch,
    ),
  }),
)(Ledger)
