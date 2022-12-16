import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { AMMAccountHeader } from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader/AMMAccountHeader'
import { AccountTransactionTable } from 'containers/Accounts/AccountTransactionTable/index'
import NoMatch from 'containers/NoMatch'
import 'containers/Accounts/styles.scss'
import { analytics, ANALYTIC_TYPES, formatAsset } from 'containers/shared/utils'
import { Tabs } from 'containers/shared/components/Tabs'
import { AccountAssetTab } from 'containers/Accounts/AccountAssetTab/AccountAssetTab'
import { getAccountTransactions, getAMMInfo } from 'rippled/lib/rippled'
import formatBalance from 'rippled/lib/txSummary/formatAmount'
import SocketContext from '../../../shared/SocketContext'
import { ERROR_MESSAGES } from '../../Errors'

export interface AmmDataType {
  balance: { currency: string; amount: number; issuer: string }
  balance2: { currency: string; amount: number; issuer: string }
  lpBalance: number
  ammId: string
  tradingFee: number
  accountId: string
  language: string
}

const getErrorMessage = (error: string) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const AMMAccounts = (props: any) => {
  const { id: accountId, tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
  const mainPath = `${path.split('/:')[0]}/${accountId}`
  const rippledSocket = useContext(SocketContext)
  const [data, setData] = useState<AmmDataType>()
  const [error, setError] = useState<any>()
  const { language } = props

  useEffect(() => {
    let asset1: { currency: string; issuer?: string }
    let asset2: { currency: string; issuer?: string }
    let ammData: any

    /*
    Get the first account transaction which in this case should be AMMInstanceCreate. From this we get
    the two assets in the asset pool.
    */
    getAccountTransactions(rippledSocket, accountId, 1, undefined, true)
      .then((tData) => {
        const { tx } = tData.transactions[0]
        asset1 = formatAsset(tx.Amount)
        asset2 = formatAsset(tx.Amount2)

        // if one of the assets is XRP, make sure it's the second one
        if (asset1.currency === 'XRP') {
          const temp = asset2
          asset2 = asset1
          asset1 = temp
        }

        return getAMMInfo(rippledSocket, asset1, asset2)
      })

      /*
      Use the assets to get the AMM Info.
      */
      .then((ammDataWrapper) => {
        ammData = ammDataWrapper.amm
        const balance = formatBalance(ammData.Amount)
        const balance2 = formatBalance(ammData.Amount2)

        const ammInfo: AmmDataType = {
          ammId: ammData.AMMID,
          balance,
          balance2,
          tradingFee: ammData.TradingFee,
          lpBalance: ammData.LPToken.value,
          accountId,
          language,
        }

        setData(ammInfo)
      })
      .catch((e) => {
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `Error setting up amm account --- ${JSON.stringify(
            e,
          )}`,
        })

        if (e.message !== 'onthedex failure') setError(e)
      })
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

  const tabs = ['transactions']
  const txProps = {
    accountId,
    currencySelected: 'XRP',
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
        </>
      )}
    </div>
  )
}

export default connect(() => ({}))(AMMAccounts)
