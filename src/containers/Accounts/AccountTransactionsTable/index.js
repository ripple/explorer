import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'

import { ReactComponent as SuccessIcon } from '../../shared/images/success.svg'
import { ReactComponent as FailIcon } from '../../shared/images/ic_fail.svg'
import { localizeDate, concatTx } from '../../shared/utils'
import { loadAccountTransactions } from './actions'
import Loader from '../../shared/components/Loader'
import TxDetails from '../../shared/components/TxDetails'
import './styles.scss'
import TxLabel from '../../shared/components/TxLabel'
import SocketContext from '../../shared/SocketContext'
import { LoadMoreButton } from '../../shared/LoadMoreButton'

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

export const AccountTxTable = (props) => {
  const { actions, data, loadingError } = props
  const [transactions, setTransactions] = useState([])
  const [marker, setMarker] = useState(null)
  const { id: accountId } = useParams()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  useEffect(() => {
    if (data.transactions == null) return
    setMarker(data.marker)
    setTransactions((oldTransactions) =>
      concatTx(oldTransactions, data.transactions),
    )
  }, [accountId, data])

  useEffect(() => {
    setTransactions([])
    setMarker(null)
    actions.loadAccountTransactions(accountId, undefined, rippledSocket)
  }, [accountId])

  const loadMoreTransactions = () => {
    actions.loadAccountTransactions(accountId, marker, rippledSocket)
  }

  const renderListItem = (tx) => {
    const { language } = props
    const success = tx.result === 'tesSUCCESS'
    const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS)
    const status = success ? 'Success' : `Fail - ${tx.result}`

    return (
      <li
        key={tx.hash}
        className={`transaction-li anchor-mask tx-type ${tx.type} ${
          success ? 'success' : 'fail'
        }`}
      >
        <Link to={`/transactions/${tx.hash}`} className="mask-overlay" />
        <div className="upper">
          <div className="col-account">
            <div className="transaction-address" title={tx.account}>
              {tx.account}
            </div>
          </div>
          <div className={`col-type tx-type ${tx.type}`}>
            <TxLabel type={tx.type} t={t} />
          </div>
          <div className="col-status">
            <span
              title={tx.result}
              className={`tx-result ${success ? 'success' : 'fail'}`}
            >
              {success ? (
                <SuccessIcon className="successful" alt={t('success')} />
              ) : (
                <FailIcon className="failed" alt={t('fail')} />
              )}
              <span className="status">{status}</span>
            </span>
          </div>
          <div className="col-date">{date}</div>
        </div>
        <div className="details">
          <TxDetails
            language={language}
            type={tx.type}
            instructions={tx.details.instructions}
          />
        </div>
      </li>
    )
  }

  const renderLoadMoreButton = () =>
    marker && <LoadMoreButton onClick={() => loadMoreTransactions()} />

  const renderListContents = () => {
    const { loading, currencySelected } = props
    let processedTransactions = transactions
    if (currencySelected !== 'XRP') {
      processedTransactions = transactions.filter(
        (tx) =>
          !currencySelected ||
          (currencySelected &&
            JSON.stringify(tx).includes(
              `"currency":"${currencySelected.toUpperCase()}"`,
            )),
      )
      if (processedTransactions.length === 0) {
        return (
          <div className="empty-transactions-message">
            Try loading more transactions
          </div>
        )
      }
    }
    if (!loading && processedTransactions.length === 0 && !loadingError) {
      return (
        <div className="empty-transactions-message">
          {t('no_transactions_message')}
        </div>
      )
    }
    return processedTransactions.map((transaction) =>
      renderListItem(transaction),
    )
  }

  const { loading } = props

  return (
    <div className="section transactions-table">
      <ol className="account-transactions">
        <li className="transaction-li transaction-li-header">
          <div className="col-account">{t('account')}</div>
          <div className="col-type">{t('transaction_type')}</div>
          <div className="col-status">{t('status')}</div>
          <div className="col-date">{t('transactions.date_header')}</div>
        </li>
        {renderListContents()}
      </ol>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  )
}

AccountTxTable.propTypes = {
  language: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  data: PropTypes.shape({
    marker: PropTypes.string,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        link: PropTypes.string,
        date: PropTypes.string,
        creator: PropTypes.string,
        image: PropTypes.string,
        speed: PropTypes.number,
      }),
    ),
  }).isRequired,
  actions: PropTypes.shape({
    loadAccountTransactions: PropTypes.func,
  }).isRequired,
  currencySelected: PropTypes.string.isRequired,
}

AccountTxTable.defaultProps = {
  loadingError: '',
}

export default connect(
  (state) => ({
    language: state.app.language,
    width: state.app.width,
    loadingError: state.accountTransactions.error,
    loading: state.accountTransactions.loading,
    data: state.accountTransactions.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadAccountTransactions,
      },
      dispatch,
    ),
  }),
)(AccountTxTable)
