import { useTranslation } from 'react-i18next'
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
import { XRP_BASE } from '../../shared/transactionUtils'
import { HeaderBoxes } from '../components/HeaderBoxes'
import { FC } from 'react'
import { Link } from 'react-router-dom'

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
          <TokenTableRow label={t('fee_rate')} value={`${rate}%`} />
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
      parseInt(balance, 10) / XRP_BASE || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const reserveBalance = localizeNumber(
      reserve || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const obligationsBalance = formatLargeNumber(
      Number.parseFloat(obligations || '0'),
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

  const dummyOverviewData = {
    price: '$0.00',
    holders: 0,
    trustlines: 0,
    transfer_fee: '0%',
    reputation_level: 'N/A',
  }

  const dummyMarketData = {
    supply: '0',
    circ_supply: '0',
    market_cap: '$0.00',
    volume_24h: '$0.00',
    trades_24h: 0,
    amm_tvl: '$0.00',
  }

  const dummyToken = {
    currency: 'USD',
    issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    meta: {
      token: {
        asset_class: 'rwa',
        asset_subclass: 'stablecoin',
        desc: "Bitstamp's USD is a fully backed U.S. Dollar IOU on the XRPL. It can be redeemed into real Dollars on bitstamp.net. For support, visit their website or X @BitstampSupport",
        icon: 'https://s1.xrplmeta.org/icon/C676A0DE05.png',
        name: 'US Dollar',
        trust_level: 3,
        urls: [
          {
            url: 'https://bitstamp.net',
            type: 'website',
          },
          {
            url: 'https://x.com/Bitstamp',
            type: 'social',
          },
        ],
      },
      issuer: {
        domain: 'bitstamp.net',
        icon: 'https://s1.xrplmeta.org/icon/DDDEC1BEED.png',
        kyc: true,
        name: 'Bitstamp',
        trust_level: 3,
      },
    },
    metrics: {
      trustlines: 25859,
      holders: 7453,
      supply: '10837710.3517544',
      marketcap: '3553768.87652062',
      price: '0.327907718621149',
      volume_24h: '364.052800999997',
      volume_7d: '17631.4027129997',
      exchanges_24h: '132',
      exchanges_7d: '1206',
      takers_24h: '30',
      takers_7d: '62',
    },
  }

  const TokenName: FC<{ token: any }> = ({ token }) =>
    token && token.meta?.token.name ? (
      <div className="token-name">
        (
        {token.meta.token.name
          .trim()
          .toUpperCase()
          .replace('(', '')
          .replace(')', '')}
        )
      </div>
    ) : null

  const tokenLogo = 'https://s1.xrplmeta.org/icon/03DDEF3C9D.png'
  const tokenURL = `https://bitstamp.net`
  return (
    <div className="box token-header">
      <div className="section token-indicator">
        <div className="token-label">Token</div>
        <div className="category-pill">
          <div className="category-text">IOU</div>
        </div>
      </div>
      <div className="section box-header">
        {tokenLogo && (
          <img
            className="token-logo"
            alt={`${currency} logo`}
            src={tokenLogo}
          />
        )}
        <Currency currency={currency} />
        <span className="issuer-separator">&nbsp;</span>
        <TokenName token={dummyToken} />
        {tokenURL && (
          <div className="issuer-ext-link">
            <img className="issuer-ext-link-icon" src="/globe.svg" />
            <DomainLink domain={tokenURL} keepProtocol={false} />
          </div>
        )}
      </div>
      <div className="section box-content">
        <HeaderBoxes
          overviewData={dummyOverviewData}
          marketData={dummyMarketData}
        />
      </div>
      {/* <div className="box-content">{renderHeaderContent()}</div> */}
    </div>
  )
}
