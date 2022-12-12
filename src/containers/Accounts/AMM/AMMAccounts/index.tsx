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
  formatAsset,
  formatBalance,
} from 'containers/shared/utils'
import { Tabs } from 'containers/shared/components/Tabs'
import { AccountAssetTab } from 'containers/Accounts/AccountAssetTab/AccountAssetTab'
import { getAccountTransactions, getAMMInfo } from 'rippled/lib/rippled'
import SocketContext from '../../../shared/SocketContext'
import { ERROR_MESSAGES } from '../../Errors'
import { getTokenPairData } from '../../../../apis/OnTheDex'

export interface AmmDataType {
  balance: { currency: string; amount: number; issuer: string }
  balance2: { currency: string; amount: number; issuer: string }
  lpBalance: number
  ammId: string
  tradingFee: number
  accountId: string
  language: string
  tvl?: number
}

const getErrorMessage = (error: string) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const USDGatehub = {
  currency: 'USD',
  issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
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
  const [tvl, setTVL] = useState<any>()
  const { language } = props

  useEffect(() => {
    let asset1: { currency: string; issuer?: string }
    let asset2: { currency: string; issuer?: string }
    let volumeAsset1: number
    let volumeAsset2: number
    let assetXrpValue: number
    let asset2XrpValue: number
    let ammData: any
    let balance: any
    let balance2: any

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
        balance = formatBalance(ammData.Amount)
        balance2 = formatBalance(ammData.Amount2)
        volumeAsset1 = balance.amount
        volumeAsset2 = balance2.amount

        const ammInfo: AmmDataType = {
          ammId: ammData.AMMID,
          balance,
          balance2,
          tradingFee: ammData.TradingFee,
          lpBalance: ammData.LPToken.value,
          accountId,
          language,
          tvl: undefined,
        }

        setData(ammInfo)

        // TODO: need to unhardcode when pushing PR
        return getTokenPairData(asset1, { currency: 'XRP' })
      })

      /*
      Get the pricing data for Asset 1 using the OnTheDex API. Each call gets a XRP quote
      */
      .then((asset1PriceDataResponse) => {
        if (
          asset1PriceDataResponse.error ||
          asset1PriceDataResponse.pairs?.length < 1
        ) {
          throw new Error('onthedex failure')
        }
        const asset1PriceData = asset1PriceDataResponse.pairs[0]
        assetXrpValue = asset1PriceData.price_mid

        /*
        Earlier we've guaranteed that if one of the assets is XRP, then it will be asset 2.
        If the asset2 is XRP - we don't need a third pricing call. We just need the value of XRP to USD. Set the
        asset2XRPValue to 1 since 1XRP = 1XRP

        If the asset2 is NOT XRP - make a pricing call to get the amount in XRP.

        The reason we do this is to avoid making the third call if one of the assets was XRP.
         */
        if (asset2.currency !== 'XRP') {
          return getTokenPairData(asset2, { currency: 'XRP' }).then(
            (asset2PriceData) => {
              if (
                asset2PriceData.error ||
                asset1PriceDataResponse.pairs?.length < 1
              ) {
                throw new Error('onthedex failure')
              }

              asset2XrpValue = asset2PriceData.pairs[0].price_mid

              return getTokenPairData({ currency: 'XRP' }, USDGatehub)
            },
          )
        }

        asset2XrpValue = 1
        return getTokenPairData(asset2, USDGatehub)
      })

      /*
      Calculate TVL with the obtained values
      */
      .then((xrpPriceData) => {
        if (!xrpPriceData.error || xrpPriceData.pairs?.length < 1) {
          const xrpPrice = xrpPriceData.pairs[0].price_mid
          const xrpPriceAsset = assetXrpValue * xrpPrice
          const xrpPriceAsset2 = asset2XrpValue * xrpPrice
          setTVL(xrpPriceAsset * volumeAsset1 + xrpPriceAsset2 * volumeAsset2)
        }
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
          <AMMAccountHeader {...data!} tvl={tvl} />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && <AccountTransactionTable {...txProps} />}
          {tab === 'assets' && <AccountAssetTab />}
        </>
      )}
    </div>
  )
}

export default connect(() => ({}))(AMMAccounts)
