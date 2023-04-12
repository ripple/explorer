import { useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadAccountState } from './actions'
import Loader from '../../shared/components/Loader'
import '../../shared/css/nested-menu.scss'
import './styles.scss'
import './balance-selector.scss'
import BalanceSelector from './BalanceSelector'
import { Account } from '../../shared/components/Account'
import { localizeNumber } from '../../shared/utils'
import SocketContext from '../../shared/SocketContext'
import InfoIcon from '../../shared/images/info.svg'
import { useLanguage } from '../../shared/hooks'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

interface AccountHeaderProps {
  onSetCurrencySelected: Function
  currencySelected: string
  loading: boolean
  accountId: string
  data: {
    balances: {
      XRP: number
    }
    paychannels: {
      // eslint-disable-next-line camelcase
      total_available: string
      channels: any[]
    }
    escrows: {
      totalIn: number
      totalOut: number
    }
    signerList: {
      signers: {
        account: string
        weight: number
      }[]
      quorum: number
      maxSigners: number
    }
    info: {
      reserve: number
      sequence: number
      ticketCount: number
      domain: string
      emailHash: string
      flags: string[]
      nftMinter: string
    }
    xAddress: {
      classicAddress: string
      tag: number | boolean
      test: boolean
    }
    deleted: boolean
  }
  actions: {
    loadAccountState: typeof loadAccountState
  }
}

const AccountHeader = (props: AccountHeaderProps) => {
  const [showBalanceSelector, setShowBalanceSelector] = useState(false)
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const language = useLanguage()

  const {
    accountId,
    actions,
    data,
    onSetCurrencySelected,
    currencySelected,
    loading,
  } = props
  const { deleted } = data
  useEffect(() => {
    actions.loadAccountState(accountId, rippledSocket)
  }, [accountId, actions, rippledSocket])

  function toggleBalanceSelector(force?) {
    setShowBalanceSelector(force !== undefined ? force : !showBalanceSelector)
  }

  function renderBalancesSelector() {
    const { balances = {} } = data
    return (
      Object.keys(balances).length > 1 && (
        <div className="balance-selector-container">
          <BalanceSelector
            language={language}
            text={`${Object.keys(balances).length - 1} ${t(
              'accounts.other_balances',
            )}`}
            expandMenu={showBalanceSelector}
            balances={balances}
            onClick={() => toggleBalanceSelector()}
            onMouseLeave={() => toggleBalanceSelector(false)}
            onSetCurrencySelected={(currency) =>
              onSetCurrencySelected(currency)
            }
            currencySelected={currencySelected}
          />
        </div>
      )
    )
  }

  function renderPaymentChannels() {
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

  function renderEscrows() {
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

  function renderSignerList() {
    const { signerList } = data
    return (
      signerList && (
        <div className="signer-list secondary">
          <div className="title">{t('signers')}</div>
          <ul>
            {signerList.signers.map((d) => (
              <li key={d.account}>
                <Account account={d.account} />
                <span className="weight">
                  <span className="label">{` ${t('weight')}: `}</span>
                  <b>{d.weight}</b>
                </span>
              </li>
            ))}
            <li className="quorum">
              <b>{signerList.quorum}</b>
              <span className="label"> {t('out_of')} </span>
              <b>{signerList.maxSigners}</b>
              <span className="label"> {t('required')}</span>
            </li>
          </ul>
        </div>
      )
    )
  }

  // TODO: show X-address on 'classic' account pages

  function renderExtendedAddress() {
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

  function renderInfo() {
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
                <a href={`http://${info.domain}`}>{info.domain}</a>
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

  function renderHeaderContent() {
    const { balances = {} } = data
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
          {renderExtendedAddress()}
          <div className="secondary balance">
            {deleted ? (
              <div className="warning">
                <InfoIcon alt="Account Deleted" />
                <span className="account-deleted-text">Account Deleted</span>
              </div>
            ) : (
              <>
                <div className="title">{`${currencySelected} Balance`}</div>
                <div className="value">{balance}</div>
              </>
            )}
            {renderBalancesSelector()}
          </div>
          {renderSignerList()}
        </div>
        <div className="column second">
          {renderInfo()}
          {renderEscrows()}
          {renderPaymentChannels()}
        </div>
      </div>
    )
  }

  const { xAddress } = data
  return (
    <div className="box account-header">
      <div className="section box-header">
        <h1 className={xAddress ? 'x-address' : 'classic'}>{accountId}</h1>
      </div>
      <div className="box-content">
        {loading ? <Loader /> : renderHeaderContent()}
      </div>
    </div>
  )
}

export default connect(
  (state: any) => ({
    loading: state.accountHeader.loading,
    data: state.accountHeader.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadAccountState,
      },
      dispatch,
    ),
  }),
)(AccountHeader)
