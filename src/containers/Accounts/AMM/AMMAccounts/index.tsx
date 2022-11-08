import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import AMMAccountHeader from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader/AMMAccountHeader'
import { AccountTransactionTable } from 'containers/Accounts/AccountTransactionTable/index'
import NoMatch from 'containers/NoMatch'

import 'containers/Accounts/styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from 'containers/shared/utils'
import { Tabs } from 'containers/shared/components/Tabs'
import { AccountAssetTab } from 'containers/Accounts/AccountAssetTab/AccountAssetTab'
import SocketContext from '../../../shared/SocketContext'
import {
  getAccountTransactions,
  getAMMInfo,
} from '../../../../rippled/lib/rippled'

const ERROR_MESSAGES: { [index: string]: any } = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'account_not_found',
  hints: ['check_account_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_account_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

export interface AmmDataType {
  balance: { currency: string; amount: number }
  balance2: { currency: string; amount: number }
  lpBalance: number
  ammId: string
  tradingFee: number
  accountId: string
  language: string
}

const getErrorMessage = (error: string) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const formatAsset = (asset: any) =>
  typeof asset === 'string'
    ? { currency: 'XRP' }
    : {
        currency: asset.currency,
        issuer: asset.issuer,
      }

const formatBalance = (asset: any) => {
  const drop = 1000000
  return typeof asset === 'string'
    ? { currency: 'XRP', amount: Number(asset) / drop }
    : {
        currency: asset.currency,
        amount: Number(asset.value),
      }
}

const AMMAccounts = (props: any) => {
  const { id: accountId, tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
  const mainPath = `${path.split('/:')[0]}/${accountId}`
  const [currencySelected] = useState('XRP')
  const rippledSocket = useContext(SocketContext)
  const [data, setData] = useState<AmmDataType>()
  const [error, setError] = useState<any>()
  const { language } = props

  useEffect(() => {
    getAccountTransactions(rippledSocket, accountId, 1, undefined, true).then(
      (tData) => {
        const { tx } = tData.transactions[0]
        const asset1 = formatAsset(tx.Asset1)
        const asset2 = formatAsset(tx.Asset2)

        getAMMInfo(rippledSocket, asset1, asset2)
          .then((d) => {
            const balance = formatBalance(d.Asset1)
            const balance2 = formatBalance(d.Asset2)

            const ammData: AmmDataType = {
              ammId: d.AMMID,
              balance,
              balance2,
              tradingFee: d.TradingFee,
              lpBalance: d.LPToken.value,
              accountId,
              language,
            }

            setData(ammData)
          })
          .catch((e) => {
            analytics(ANALYTIC_TYPES.exception, {
              exDescription: `getAMMInfo ${asset1} & ${asset2} --- ${JSON.stringify(
                e,
              )}`,
            })

            setError(e)
          })
      },
    )
  }, [accountId, rippledSocket])

  function renderError() {
    const message = getErrorMessage(error)
    return (
      <div className="accounts-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`

  const tabs = ['transactions', 'assets']
  const txProps = {
    accountId,
    currencySelected,
    hasTokensColumn: true,
  }
  return error ? (
    renderError()
  ) : (
    <div className="accounts-page section">
      {data && (
        <>
          <AMMAccountHeader {...data!} />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && <AccountTransactionTable {...txProps} />}
          {tab === 'assets' && <AccountAssetTab />}
        </>
      )}
    </div>
  )
}

interface State {
  accountHeader: {
    status: string
  }
}

export default connect((state: State) => ({
  error: state.accountHeader.status,
}))(AMMAccounts)
