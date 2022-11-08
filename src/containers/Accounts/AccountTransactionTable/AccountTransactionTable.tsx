import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useParams } from 'react-router'

import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import SocketContext from '../../shared/SocketContext'
import { concatTx } from '../../shared/utils'

import { loadAccountTransactions } from './actions'

// There will be fewer props in the next PR when react-query is used instead of redux.
// It's `any` for now
const AccountTransactionTable = (props: any) => {
  const { actions, data, loadingError, hasTokensColumn } = props
  const [transactions, setTransactions] = useState([])
  const [marker, setMarker] = useState(null)
  const { id: accountId } = useParams<{ id: string }>()
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

  const filterTransactions = () => {
    const { currencySelected } = props
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
    }
    return processedTransactions
  }

  const { loading } = props

  return (
    <TransactionTable
      transactions={filterTransactions()}
      loading={loading}
      emptyMessage={t(loadingError)}
      onLoadMore={loadMoreTransactions}
      hasAdditionalResults={!!marker}
      hasTokensColumn={hasTokensColumn}
    />
  )
}

AccountTransactionTable.propTypes = {
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

AccountTransactionTable.defaultProps = {
  loadingError: '',
}

export default connect(
  // This will be removed in the next PR
  (state: any) => ({
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
)(AccountTransactionTable)
