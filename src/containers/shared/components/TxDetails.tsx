import React, { ReactElement } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, withTranslation } from 'react-i18next'
import { ACCOUNT_FLAGS, decodeHex } from '../transactionUtils'
import { Amount } from './Amount'
import { transactionTypes } from './Transaction'
import { Account } from './Account'

interface Instructions {
  owner: string
  sequence: number
  ticketSequence: number
  fulfillment: string
  finishAfter: string
  cancelAfter: string
  condition: string
  quorum: number
  max: {
    amount: number
    currency: string
    issuer: string
  }
  maxSigners: number
  signers: any[]
  domain: string
  // eslint-disable-next-line camelcase
  email_hash: string
  // eslint-disable-next-line camelcase
  message_key: string
  // eslint-disable-next-line camelcase
  set_flag: number
  // eslint-disable-next-line camelcase
  clear_flag: number
  key: string
  limit: any
  pair: string
  sourceTag: number
  source: string
  claimed: any
  // eslint-disable-next-line camelcase
  channel_amount: number
  remaining: number
  renew: boolean
  close: boolean
  deleted: boolean
  gets: any
  pays: any
  price: string
  cancel: number
  convert: any
  amount: any
  destination: string
  partial: boolean
  ticketCount: number
  // eslint-disable-next-line camelcase
  nftoken_minter: string
}

interface Props {
  instructions: Instructions
  type: string
}

const TxDetails = (props: Props) => {
  const { t } = useTranslation()

  function renderAmount(d: any): ReactElement {
    return <Amount value={d} />
  }

  function renderAccountSet(): ReactElement {
    const { instructions } = props
    return (
      <>
        {instructions.domain && (
          <div>
            <span className="label">{t('domain')}:</span>{' '}
            <span className="domain">{decodeHex(instructions.domain)}</span>
          </div>
        )}
        {instructions.email_hash && (
          <div>
            <span className="label">{t('email_hash')}:</span>{' '}
            <span className="email-hash">{instructions.email_hash}</span>
          </div>
        )}
        {instructions.message_key && (
          <div>
            <span className="label">{t('message_key')}:</span>{' '}
            <span className="message-key">{instructions.message_key}</span>
          </div>
        )}
        {instructions.set_flag && (
          <div>
            <span className="label">{t('set_flag')}:</span>{' '}
            <span className="flag">
              {ACCOUNT_FLAGS[Number(instructions.set_flag)] ||
                instructions.set_flag}
            </span>
          </div>
        )}
        {instructions.clear_flag && (
          <div>
            <span className="label">{t('clear_flag')}:</span>{' '}
            <span className="flag">
              {ACCOUNT_FLAGS[Number(instructions.clear_flag)] ||
                instructions.clear_flag}
            </span>
          </div>
        )}
        {instructions.nftoken_minter && (
          <div>
            <span className="label">{t('nftoken_minter')}:</span>{' '}
            <span className="domain">
              <Account account={instructions.nftoken_minter} />
            </span>
          </div>
        )}
        {Object.keys(instructions).length === 0 && (
          <div className="empty">{t('no_account_settings')}</div>
        )}
      </>
    )
  }

  function renderPaymentChannelCreate(): ReactElement {
    const { instructions } = props
    const { amount, source, destination } = instructions

    return (
      <div className="paymentChannelCreate">
        <div>
          <span className="label">{t('source')}</span>
          <span className="account">{source}</span>
        </div>
        <div>
          <span className="label">{t('destination')}</span>
          <span className="account"> {destination} </span>
        </div>
        <div>
          <span className="label">{t('channel_amount')}</span>
          {renderAmount(amount)}
        </div>
      </div>
    )
  }

  function renderPaymentChannelClaim(): ReactElement {
    const { instructions } = props
    const {
      source,
      destination,
      claimed,
      channel_amount: amount,
      remaining,
      renew,
      close,
      deleted,
    } = instructions

    return (
      <div className="paymentChannelClaim">
        {source && (
          <div>
            <span className="label">{t('source')}</span>
            <span className="account"> {source} </span>
          </div>
        )}
        {destination && (
          <div>
            <span className="label">{t('destination')}</span>
            <span className="account"> {destination} </span>
          </div>
        )}
        {claimed && (
          <div>
            <span className="label">{t('claimed')}</span>
            {renderAmount(claimed)}
            {remaining && amount && (
              <span>
                ({renderAmount(remaining)}
                <span>{t('out_of')}</span>
                {renderAmount(amount)}
                {t('remaining')})
              </span>
            )}
          </div>
        )}
        {amount && !claimed && (
          <div>
            <span className="label">{t('channel_amount')}</span>
            {renderAmount(amount)}
          </div>
        )}
        {renew && <div className="flag">{t('renew_channel')}</div>}
        {close && <div className="flag">{t('close_request')}</div>}
        {deleted && <div className="closed">{t('payment_channel_closed')}</div>}
      </div>
    )
  }
  const { type = '', instructions } = props
  const functionMap: { [key: string]: () => ReactElement | null } = {
    renderAccountSet,
    renderPaymentChannelCreate,
    renderPaymentChannelClaim,
  }

  // Locate the component for detail row that is unique per TransactionType.
  const TableDetail = transactionTypes[type]?.TableDetail
  if (TableDetail) {
    return <TableDetail instructions={instructions} />
  }

  // Locate the unique transaction component the old way
  // TODO: Remove once all transactions have been moved to the new definition style
  if (functionMap[`render${type}`]) {
    return functionMap[`render${type}`]()
  }

  return null
}

TxDetails.propTypes = {
  instructions: PropTypes.shape({
    owner: PropTypes.string,
    sequence: PropTypes.number,
    ticketSequence: PropTypes.number,
    fulfillment: PropTypes.string,
    finishAfter: PropTypes.string,
    cancelAfter: PropTypes.string,
    condition: PropTypes.string,
    quorum: PropTypes.number,
    max: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      issuer: PropTypes.string.isRequired,
    }),
    maxSigners: PropTypes.number,
    signers: PropTypes.arrayOf(PropTypes.shape({})),
    domain: PropTypes.string,
    email_hash: PropTypes.string,
    message_key: PropTypes.string,
    set_flag: PropTypes.number,
    clear_flag: PropTypes.number,
    key: PropTypes.string,
    limit: PropTypes.shape({}),
    pair: PropTypes.string,
    sourceTag: PropTypes.number,
    source: PropTypes.string,
    claimed: PropTypes.shape({}),
    channel_amount: PropTypes.number,
    remaining: PropTypes.number,
    renew: PropTypes.bool,
    close: PropTypes.bool,
    deleted: PropTypes.bool,
    gets: PropTypes.shape({}),
    pays: PropTypes.shape({}),
    price: PropTypes.string,
    cancel: PropTypes.number,
    convert: PropTypes.shape({}),
    amount: PropTypes.shape({}),
    destination: PropTypes.string,
    partial: PropTypes.bool,
    ticketCount: PropTypes.number,
    nftoken_minter: PropTypes.string,
  }),
  type: PropTypes.string,
}

TxDetails.defaultProps = {
  instructions: {},
  type: null,
}

export default withTranslation()(TxDetails)
