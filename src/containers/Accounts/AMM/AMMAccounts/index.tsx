import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../../../shared/hooks'
import '../../styles.scss'
import { formatAmount } from '../../../../rippled/lib/txSummary/formatAmount'
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

function renderError(error: any) {
  const message = getErrorMessage(error.code)
  return (
    <div className="accounts-page">
      <NoMatch title={message.title} hints={message.hints} />
    </div>
  )
}

const Page: FC<PropsWithChildren<{ accountId: string }>> = ({
  accountId,
  children,
}) => (
  <div className="accounts-page">
    <Helmet title={`AMM ${accountId.substr(0, 12)}...`} />
    {children}
  </div>
)

export function AMMAccounts() {
  const { id: accountId, tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const { path = '/' } = useRouteMatch()
  const mainPath = `${path.split('/:')[0]}/${accountId}`
  const rippledSocket = useContext(SocketContext)
  const language = useLanguage()

  const { data, error } = useQuery([accountId, language], () => {
    let asset1: { currency: string; issuer?: string }
    let asset2: { currency: string; issuer?: string }
    let ammData: any

    /*
    Get the first account transaction which in this case should be AMMCreate. From this we get
    the two assets in the asset pool.
    */
    return (
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
          const balance = formatAmount(ammData.amount)
          const balance2 = formatAmount(ammData.amount2)

          const ammInfo: AmmDataType = {
            balance,
            balance2,
            tradingFee: ammData.trading_fee,
            lpBalance: ammData.lp_token.value,
            accountId,
            language,
          }

          return ammInfo
        })
        .catch((e) => {
          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `Error setting up amm account --- ${JSON.stringify(
              e,
            )}`,
          })

          throw e
        })
    )
  })

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  const tabs = ['transactions']

  if (error) {
    return <Page accountId={accountId}>{renderError(error)}</Page>
  }

  return (
    <div className="accounts-page section">
      {data && (
        <>
          <AMMAccountHeader data={data} />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && (
            <AccountTransactionTable accountId={accountId} hasTokensColumn />
          )}
        </>
      )}
    </div>
  )
}
