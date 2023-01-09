import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../shared/hooks'
import '../../styles.scss'
import formatBalance from '../../../../rippled/lib/txSummary/formatAmount'
import {
  getAccountTransactions,
  getAMMInfo,
} from '../../../../rippled/lib/rippled'
import { Tabs } from '../../../shared/components/Tabs'
import { analytics, ANALYTIC_TYPES, formatAsset } from '../../../shared/utils'
import SocketContext from '../../../shared/SocketContext'
import { ERROR_MESSAGES } from '../../Errors'
import NoMatch from '../../../NoMatch'
import {
  AMMAccountHeader,
  AmmDataType,
} from './AMMAccountHeader/AMMAccountHeader'
import { AccountTransactionTable } from '../../AccountTransactionTable'

const getErrorMessage = (error: string) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

function findAMMCreate(txs: [any]) {
  const ammCreate = txs.filter((tx) => tx.tx.TransactionType === 'AMMCreate')

  if (ammCreate.length < 1) throw new Error('Could not find AMM Create')

  return ammCreate[0].tx
}

export const AMMAccounts = () => {
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
  const language = useLanguage()

  useEffect(() => {
    let asset1: { currency: string; issuer?: string }
    let asset2: { currency: string; issuer?: string }
    let ammData: any

    /*
    Get the first account transaction which in this case should be AMMCreate. From this we get
    the two assets in the asset pool.
    */
    getAccountTransactions(rippledSocket, accountId, 1, undefined, true)
      .then((tData) => {
        const tx = findAMMCreate(tData.transactions)
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
        const balance = formatBalance(ammData.amount)
        const balance2 = formatBalance(ammData.amount2)

        const ammInfo: AmmDataType = {
          balance,
          balance2,
          tradingFee: ammData.trading_fee,
          lpBalance: ammData.lp_token.value,
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

        setError(e)
      })
  }, [accountId, rippledSocket, language])

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

  return error ? (
    renderError()
  ) : (
    <div className="accounts-page section">
      {data && (
        <>
          <AMMAccountHeader data={data} />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && (
            <AccountTransactionTable
              accountId={accountId}
              hasTokensColumn={false}
            />
          )}
        </>
      )}
    </div>
  )
}
