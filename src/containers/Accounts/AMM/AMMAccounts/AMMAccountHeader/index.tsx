import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from 'containers/shared/components/Loader'
import 'containers/shared/css/nested-menu.scss'
import 'containers/Accounts/AccountHeader/styles.scss'
import 'containers/Accounts/AccountHeader/balance-selector.scss'
import SocketContext from 'containers/shared/SocketContext'
import { loadAMMAccountInfo } from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader/actions'
import { getAccountTransactions } from 'rippled/lib/rippled'

interface propTypes {
  accountId: string
  loading: boolean
}

const AMMAccountHeader = (props: propTypes) => {
  const rippledSocket = useContext(SocketContext)
  const { accountId, loading } = props
  const { t } = useTranslation()

  useEffect(() => {
    getAccountTransactions(rippledSocket, accountId, 1, undefined, true).then(
      (tData) => {
        const txs = tData.transactions
        const ammID = txs.AMMId

        loadAMMAccountInfo(ammID, rippledSocket).then(() => {})
      },
    )
  }, [accountId, rippledSocket])

  function renderHeaderContent() {
    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('amm_lp_token_balance')}</div>
            <div className="value">{0}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_token_balance')}</div>
            <div className="value">{0}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_token_balance')}</div>
            <div className="value">{0}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_trading_fee')}</div>
            <div className="value">{0}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_tvl')}</div>
            <div className="value">{0}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_account_address')}</div>
            <div className="value">{0}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="box account-header">
      <div className="section box-header">
        <h2 className="classic">{accountId}</h2>
      </div>
      <div className="box-content">
        {loading ? <Loader /> : renderHeaderContent()}
      </div>
    </div>
  )
}

interface State {
  app: { language: string }
  accountHeader: {
    loading: boolean
    data: {}
  }
}

export default connect(
  (state: State) => ({
    language: state.app.language,
    loading: state.accountHeader.loading,
    data: state.accountHeader.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadAMMAccountInfo,
      },
      dispatch,
    ),
  }),
)(AMMAccountHeader)
