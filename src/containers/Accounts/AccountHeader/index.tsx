import { Trans, useTranslation } from 'react-i18next'
import './styles.scss'
import { BalanceSelector } from './BalanceSelector/BalanceSelector'
import { Account } from '../../shared/components/Account'
import { localizeNumber } from '../../shared/utils'
import InfoIcon from '../../shared/images/info.svg'
import { useLanguage } from '../../shared/hooks'
import Currency from '../../shared/components/Currency'
import DomainLink from '../../shared/components/DomainLink'
import { AccountState } from '../../../rippled/accountState'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

interface AccountHeaderProps {
  onSetCurrencySelected: (currency: string) => void
  currencySelected: string
  account: any
  accountId: string
}

export const AccountHeader = ({
  account,
  accountId,
  onSetCurrencySelected,
  currencySelected,
}: AccountHeaderProps) => {
  const { t } = useTranslation()
  const language = useLanguage()

  function renderBalancesSelector(data: AccountState) {
    const { balances = {} } = data
    return (
      Object.keys(balances).length > 1 && (
        <div className="balance-selector-container">
          <BalanceSelector
            balances={balances}
            onSetCurrencySelected={onSetCurrencySelected}
            currencySelected={currencySelected}
          />
        </div>
      )
    )
  }

  function renderPaymentChannels(data: AccountState) {
    const { paychannels } = data
    return (
      paychannels && (
        <div className="paychannels secondary">
          <div className="title">{t('payment_channels')}</div>
          <ul>
            <li>
              <b>
                {localizeNumber(
                  paychannels.total_available,
                  language,
                  CURRENCY_OPTIONS,
                )}
              </b>
              <span className="label"> {t('available_in')} </span>
              <b>{localizeNumber(paychannels.channels.length, language)}</b>
              <span className="label"> {t('channels')} </span>
            </li>
          </ul>
        </div>
      )
    )
  }

  function renderEscrows(data: AccountState) {
    const { escrows } = data
    return (
      escrows && (
        <div className="escrows secondary">
          <div className="title">{t('escrows')}</div>
          <ul>
            <li>
              <span className="label">{t('inbound_total')}: </span>
              <b>
                {localizeNumber(escrows.totalIn, language, CURRENCY_OPTIONS)}
              </b>
            </li>
            <li>
              <span className="label">{t('outbound_total')}: </span>
              <b>
                {localizeNumber(escrows.totalOut, language, CURRENCY_OPTIONS)}
              </b>
            </li>
          </ul>
        </div>
      )
    )
  }

  function renderSignerList(data: AccountState) {
    const { signerList } = data
    return (
      signerList && (
        <div className="signer-list secondary">
          <h2>{t('signers')}</h2>
          <ul>
            {signerList.signers.map((d) => (
              <li key={d.account}>
                <span className="label">Signer</span>
                <Account account={d.account} link={false} />
                <div className="value weight">
                  <span className="label">{` ${t('weight')}:`}</span>
                  <span>{d.weight}</span>
                </div>
              </li>
            ))}

            <li className="label">
              <Trans
                i18nKey="min_signer_quorum"
                values={{ quorum: signerList.quorum }}
              />
            </li>
          </ul>
        </div>
      )
    )
  }
  // TODO: show X-address on 'classic' account pages

  function renderExtendedAddress(data: AccountState) {
    const { xAddress } = data // undefined when page has not yet finished loading

    let messageAboutTag: JSX.Element | string = ''
    if (xAddress && xAddress.tag !== false) {
      messageAboutTag = (
        <li className="tag-info">
          <span>
            <span role="img" aria-label="Caution">
              ⚠️
            </span>{' '}
            This address contains a tag, indicating it may refer to a hosted
            wallet. The balance and transactions below apply to the entire
            account. They are not filtered to the specified destination tag.
          </span>
        </li>
      )
    }

    // TODO: Translate everything e.g. {t('signers')}
    return (
      xAddress && (
        <div className="x-address secondary">
          <div className="title">Extended Address (X-address) Details</div>
          <p>
            {xAddress.classicAddress}
            {xAddress.tag ? `:${xAddress.tag}` : ''}
          </p>
          <ul>
            <li key={xAddress.classicAddress}>
              <span className="classicAddress">
                <span className="label">Classic Address: </span>
                <Account account={xAddress.classicAddress} />{' '}
                {/* TODO: Add [copy] button */}
              </span>
            </li>
            <li className="tag">
              <span className="label">Tag: </span>
              <span className="tag">
                {xAddress.tag === false ? 'false' : xAddress.tag}
              </span>
            </li>
            <li className="network">
              <span className="label">Network: </span>
              <span className="network">
                {xAddress.test ? 'Testnet' : 'Mainnet'}
              </span>
            </li>
            {messageAboutTag}
          </ul>
        </div>
      )
    )
  }

  function renderInfo(data: AccountState) {
    const { info } = data
    return (
      info && (
        <div className="info secondary">
          <div className="title">{t('account_info')}</div>
          <ul>
            <li>
              <span className="label"> {t('reserve')}: </span>
              <b>
                {localizeNumber(
                  info.reserve || 0.0,
                  language,
                  CURRENCY_OPTIONS,
                )}
              </b>
            </li>
            <li>
              <span className="label"> {t('current_sequence')}: </span>
              <b>{localizeNumber(info.sequence, language)}</b>
            </li>
            {info.ticketCount && (
              <li>
                <span className="label"> {t('ticket_count')}: </span>
                <b>{localizeNumber(info.ticketCount, language)}</b>
              </li>
            )}
            {info.domain && (
              <li>
                <span className="label"> {t('domain')}: </span>
                <DomainLink domain={info.domain} />
              </li>
            )}
            {info.emailHash && (
              <li>
                <span className="label"> {t('email_hash')}: </span>
                <b>{info.emailHash}</b>
              </li>
            )}
            {info.nftMinter && (
              <li>
                <span className="label"> {t('nftoken_minter')}: </span>
                <Account account={info.nftMinter} />
              </li>
            )}
            {info.flags.length ? (
              <li className="flags">
                <ul>
                  {info.flags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        </div>
      )
    )
  }

  function renderHeaderContent(data: AccountState) {
    const { balances = {}, deleted } = data
    const balance = localizeNumber(
      balances[currencySelected] || 0.0,
      language,
      {
        style: 'currency',
        currency: currencySelected,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    )
    return (
      <div className="section header-container">
        <div className="column first">
          {renderExtendedAddress(data)}
          <div className="secondary balance">
            {deleted ? (
              <div className="warning">
                <InfoIcon alt="Account Deleted" />{' '}
                <span className="account-deleted-text">Account Deleted</span>
              </div>
            ) : (
              <>
                <div className="title">
                  <Trans i18nKey="currency_balance">
                    <Currency
                      currency={currencySelected}
                      displaySymbol={false}
                    />
                  </Trans>
                </div>
                <div className="value">{balance}</div>
              </>
            )}
            {renderBalancesSelector(data)}
          </div>
        </div>
        <div className="column second">
          {renderInfo(data)}
          {renderEscrows(data)}
          {renderPaymentChannels(data)}
        </div>
        <div className="lower-header">
          <div className="column first">{renderSignerList(data)}</div>
        </div>
      </div>
    )
  }

  const xAddress = account?.xAddress ?? false
  const hasBridge = account?.hasBridge ?? false

  return (
    <div className="box account-header">
      <div className="section box-header">
        <div className="title">
          Account ID
          {hasBridge && <div className="badge">Door Account</div>}
        </div>
        <h1 className={xAddress ? 'x-address' : 'classic'}>{accountId}</h1>
      </div>
      <div className="box-content">
        {account != null && renderHeaderContent(account)}
      </div>
    </div>
  )
}
