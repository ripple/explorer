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
    />
  )
}

AccountTxTable.propTypes = {
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
