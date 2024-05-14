import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec'
import { Loader } from '../../shared/components/Loader'
import './styles.scss'
import {
  localizeNumber,
  formatLargeNumber,
  BAD_REQUEST,
} from '../../shared/utils'
import SocketContext from '../../shared/SocketContext'
import Currency from '../../shared/components/Currency'
import { Account } from '../../shared/components/Account'
import DomainLink from '../../shared/components/DomainLink'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { useLanguage } from '../../shared/hooks'
import { LEDGER_ROUTE, TRANSACTION_ROUTE } from '../../App/routes'
import { RouteLink } from '../../shared/routing'
import { getToken } from '../../../rippled'
import { useAnalytics } from '../../shared/analytics'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

interface TokenHeaderProps {
  accountId: string
  currency: string
}

interface TokenData {
  balance: string
  reserve: number
  sequence: number
  rate: number
  obligations: string
  domain?: string
  emailHash?: string
  previousLedger: number
  previousTxn: string
  flags: string[]
}

const TokenHeader = ({ accountId, currency }: TokenHeaderProps) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { trackException, trackScreenLoaded } = useAnalytics()

  const { data: tokenData, isLoading } = useQuery(
    ['token', accountId, currency],
    () => {
      if (!isValidClassicAddress(accountId) && !isValidXAddress(accountId)) {
        return Promise.reject(BAD_REQUEST)
      }

      return getToken(currency, accountId, rippledSocket).catch(
        (rippledError) => {
          const status = rippledError.code
          trackException(
            `token ${currency}.${accountId} --- ${JSON.stringify(
              rippledError,
            )}`,
          )
          return Promise.reject(status)
        },
      )
    },
  )

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  const renderDetails = (data: TokenData) => {
    const { domain, rate, emailHash, previousLedger, previousTxn } = data

    const prevTxn = previousTxn && previousTxn.replace(/(.{20})..+/, '$1...')
    const abbrvEmail = emailHash && emailHash.replace(/(.{20})..+/, '$1...')
    return (
      <table className="token-table">
        <tbody>
          {domain && (
            <TokenTableRow
              label={t('domain')}
              value={<DomainLink domain={domain} />}
            />
          )}
          {rate && (
            <TokenTableRow label={t('fee_rate')} value={`${rate * 100}%`} />
          )}
          {previousLedger && (
            <TokenTableRow
              label={t('last_ledger')}
              value={
                <RouteLink
                  to={LEDGER_ROUTE}
                  params={{ identifier: previousLedger }}
                >
                  {previousLedger}
                </RouteLink>
              }
            />
          )}
          <TokenTableRow
            label={t('last_affecting_transaction')}
            value={
              <RouteLink
                to={TRANSACTION_ROUTE}
                params={{ identifier: previousTxn }}
              >
                {prevTxn}
              </RouteLink>
            }
          />
          {emailHash && (
            <TokenTableRow label={t('email_hash')} value={abbrvEmail} />
          )}
        </tbody>
      </table>
    )
  }

  const renderSettings = (data: TokenData) => {
    const { flags } = data

    const rippling =
      flags && flags.includes('lsfDefaultRipple') ? 'enabled' : 'disabled'
    const depositAuth =
      flags && flags.includes('lsfDepositAuth') ? 'enabled' : 'disabled'
    const masterKey =
      flags && flags.includes('lsfDisableMaster') ? 'disabled' : 'enabled'
    const receivingXRP =
      flags && flags.includes('lsfDisallowXRP') ? 'disabled' : 'enabled'
    const frozen = flags && flags.includes('lsfGlobalFreeze') ? 'true' : 'false'
    const noFreeze = flags && flags.includes('lsfNoFreeze') ? 'true' : 'false'
    const requireAuth =
      flags && flags.includes('lsfRequireAuth') ? 'true' : 'false'
    const requireDestTag =
      flags && flags.includes('lsfRequireDestTag') ? 'true' : 'false'

    return (
      <table className="token-table">
        <tbody>
          <TokenTableRow label="Rippling" value={rippling} />
          <TokenTableRow label="Deposit Auth" value={depositAuth} />
          <TokenTableRow label="Master Key" value={masterKey} />
          <TokenTableRow label="Receiving XRP" value={receivingXRP} />
          <TokenTableRow label="Frozen" value={frozen} />
          <TokenTableRow label="No freeze" value={noFreeze} />
          <TokenTableRow label="Require Auth" value={requireAuth} />
          <TokenTableRow label="Require Dest Tag" value={requireDestTag} />
        </tbody>
      </table>
    )
  }

  const renderHeaderContent = (data: TokenData) => {
    const { balance, sequence, obligations, reserve } = data
    const currencyBalance = localizeNumber(
      parseInt(balance, 10) / 1000000 || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const reserveBalance = localizeNumber(
      reserve || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const obligationsBalance = formatLargeNumber(Number.parseFloat(obligations))

    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('accounts.xrp_balance')}</div>
            <div className="value">{currencyBalance}</div>
          </div>
          <div className="values">
            <div className="title">{t('reserve')}</div>
            <div className="value">{reserveBalance}</div>
          </div>
          <div className="values">
            <div className="title">{t('sequence_number_short')}</div>
            <div className="value">{sequence}</div>
          </div>
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Account account={accountId} />
            </div>
          </div>
          <div className="values">
            <div className="title">{t('obligations')}</div>
            <div className="value">
              {obligationsBalance.num}
              {obligationsBalance.unit}
            </div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="details">
            <h2>{t('details')}</h2>
            {renderDetails(data)}
          </div>
          <div className="settings">
            <h2 className="title">{t('settings')}</h2>
            {renderSettings(data)}
          </div>
        </div>
      </div>
    )
  }

  const emailHash = tokenData?.emailHash
  return (
    <div className="box token-header">
      <div className="section box-header">
        <Currency currency={currency} />
        {emailHash && (
          <img
            alt={`${currency} logo`}
            src={`https://www.gravatar.com/avatar/${emailHash.toLowerCase()}`}
          />
        )}
      </div>
      <div className="box-content">
        {isLoading && <Loader />}
        {tokenData != null && renderHeaderContent(tokenData)}
      </div>
    </div>
  )
}

export default TokenHeader
