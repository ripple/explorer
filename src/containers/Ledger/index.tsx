import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { useQuery } from 'react-query'
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
  DECIMAL_REGEX,
  HASH_REGEX,
} from '../shared/utils'

import LeftArrow from '../shared/images/ic_left_arrow.svg'
import RightArrow from '../shared/images/ic_right_arrow.svg'
import { LedgerTransactionTable } from './LedgerTransactionTable'

import './ledger.scss'
import { getLedger } from '../../rippled'

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
  hints: ['server_ledgers_hint'],
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

export const Ledger = () => {
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
  }, [identifier, t])

  const {
    data: ledgerData,
    error,
    isLoading,
  } = useQuery(['ledger', identifier], () => {
    if (!DECIMAL_REGEX.test(identifier) && !HASH_REGEX.test(identifier)) {
      return Promise.reject(BAD_REQUEST)
    }

    return getLedger(identifier, rippledSocket).catch(
      (transactionRequestError) => {
        const status = transactionRequestError.code
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `ledger ${identifier} --- ${JSON.stringify(error)}`,
        })
        return Promise.reject(status)
      },
    )
  })

  const renderNav = (data: any) => {
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
    ledgerData?.ledger_hash ? (
      <>
        {renderNav(ledgerData)}
        <LedgerTransactionTable
          transactions={ledgerData.transactions}
          loading={isLoading}
        />
      </>
    ) : null

  const renderError = () => {
    if (!error) {
      return null
    }

    const message = getErrorMessage(error)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  return (
    <div className="ledger-page">
      {isLoading && <Loader />}
      {renderLedger()}
      {renderError()}
    </div>
  )
}
