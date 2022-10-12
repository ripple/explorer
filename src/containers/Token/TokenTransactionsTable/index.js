import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { concatTx } from '../../shared/utils'

import { loadTokenTransactions } from './actions'
import SocketContext from '../../shared/SocketContext'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'

export const TokenTxTable = (props) => {
  const [transactions, setTransactions] = useState([])
  const [marker, setMarker] = useState(null)
  const rippledSocket = useContext(SocketContext)

  const { accountId, currency, actions, data, loading, loadingError } = props

  useEffect(() => {
    if (data.transactions == null) return
    setMarker(data.marker)
    setTransactions((oldTransactions) =>
      concatTx(oldTransactions, data.transactions),
    )
  }, [data])

  useEffect(() => {
    setTransactions([])
    setMarker(null)
    actions.loadTokenTransactions(accountId, currency, undefined, rippledSocket)
  }, [accountId, currency])

  const loadMoreTransactions = () => {
    actions.loadTokenTransactions(accountId, currency, marker, rippledSocket)
  }

  return (
    <TransactionTable
      transactions={transactions}
      loading={loading}
      onLoadMore={loadMoreTransactions}
      hasAdditionalResults={!!marker}
    />
  )
}

TokenTxTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  accountId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
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
    loadTokenTransactions: PropTypes.func,
  }).isRequired,
}

TokenTxTable.defaultProps = {
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
        loadTokenTransactions,
      },
      dispatch,
    ),
  }),
)(TokenTxTable)
