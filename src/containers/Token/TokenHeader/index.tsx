import { useTranslation } from 'react-i18next'
import { Loader } from '../../shared/components/Loader'
import './styles.scss'
import { localizeNumber, formatLargeNumber } from '../../shared/utils'
import Currency from '../../shared/components/Currency'
import { Account } from '../../shared/components/Account'
import DomainLink from '../../shared/components/DomainLink'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { useLanguage } from '../../shared/hooks'
import { LEDGER_ROUTE, TRANSACTION_ROUTE } from '../../App/routes'
import { RouteLink } from '../../shared/routing'
import { TokenData } from '../../../rippled/token'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

interface TokenHeaderProps {
  accountId: string
  currency: string
  data: TokenData
}

export const TokenHeader = ({
  accountId,
  currency,
  data,
}: TokenHeaderProps) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { domain, rate, emailHash, previousLedger, previousTxn } = data

  const renderDetails = () => {
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

  const renderSettings = () => {
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
    const clawback =
      flags && flags.includes('lsfAllowTrustLineClawback') ? 'true' : 'false'

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
          <TokenTableRow label="Allow TrustLine Clawback" value={clawback} />
        </tbody>
      </table>
    )
  }

  const renderHeaderContent = () => {
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
    const obligationsBalance = formatLargeNumber(
      Number.parseFloat(obligations || 0),
    )

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
            {renderDetails()}
          </div>
          <div className="settings">
            <h2 className="title">{t('settings')}</h2>
            {renderSettings()}
          </div>
        </div>
      </div>
    )
  }

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
      <div className="box-content">{renderHeaderContent()}</div>
    </div>
  )
}
