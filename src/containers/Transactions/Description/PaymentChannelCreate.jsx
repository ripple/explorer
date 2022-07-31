import React from 'react'
import PropTypes from 'prop-types'
import { localizeDate, localizeNumber } from '../../shared/utils'
import {
  DATE_OPTIONS,
  RIPPLE_EPOCH,
  normalizeAmount,
  findNode,
} from '../../shared/transactionUtils'
import Account from '../../shared/components/Account'

const PaymentChannelCreate = (props) => {
  const { t, language, data } = props
  const cancelAfter = localizeDate(
    (data.tx.CancelAfter + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS,
  )
  const expiration = localizeDate(
    (data.tx.Experiation + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS,
  )

  const node = findNode(data, 'CreatedNode', 'PayChannel')
  const lines = []

  lines.push(
    <div key="line1">
      {`${t('the_account')} `}
      <Account account={data.tx.Account} />
      {` ${t('create_payment_channel')} `}
      <Account account={data.tx.Destination} />
      {data.tx.DestinationTag && (
        <span className="dt">{` (${t('destination_tag')}: ${
          data.tx.DestinationTag
        }) `}</span>
      )}
    </div>,
  )

  if (node) {
    lines.push(
      <div key="line_channel">
        {t('the_channel_id_is')}
        <span className="channel"> {node.LedgerIndex}</span>
      </div>,
    )
  }

  if (data.tx.SourceTag) {
    lines.push(
      <div key="line_2">
        {t('the_source_tag_is')}
        <b> {data.tx.SourceTag}</b>
      </div>,
    )
  }

  lines.push(
    <div key="line3">
      {t('the_channel_amount_is')}
      <b>
        {' '}
        {normalizeAmount(data.tx.Amount, language)}
        <small>XRP</small>
      </b>
    </div>,
  )

  if (data.tx.SettleDelay) {
    lines.push(
      <div key="line4">
        {t('channel_settle_delay')}
        <b>
          {' '}
          {localizeNumber(data.tx.SettleDelay, language)} {t('seconds')}
        </b>
      </div>,
    )
  }

  if (data.tx.Expiration) {
    lines.push(
      <div key="line5">
        {t('describe_experiation')}
        <span className="time">{` ${expiration} ${DATE_OPTIONS.timeZone}`}</span>
      </div>,
    )
  }

  if (data.tx.CancelAfter) {
    lines.push(
      <div key="line6">
        {t('describe_cancel_after')}
        <span className="time">{` ${cancelAfter} ${DATE_OPTIONS.timeZone}`}</span>
      </div>,
    )
  }

  return lines
}

PaymentChannelCreate.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
}

export default PaymentChannelCreate
