import React from 'react'
import { useTranslation } from 'react-i18next'
import { localizeDate, localizeNumber } from '../../../utils'
import { DATE_OPTIONS, RIPPLE_EPOCH, findNode } from '../../../transactionUtils'
import { Account } from '../../Account'
import { useLanguage } from '../../../hooks'
import { TransactionDescriptionProps } from '../types'
import { PaymentChannelCreate } from './types'
import { Amount } from '../../Amount'

export const Description = ({
  data,
}: TransactionDescriptionProps<PaymentChannelCreate>) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { tx } = data
  const cancelAfter =
    tx.CancelAfter &&
    localizeDate((tx.CancelAfter + RIPPLE_EPOCH) * 1000, language, DATE_OPTIONS)

  const node = findNode(data, 'CreatedNode', 'PayChannel')
  const lines = []

  lines.push(
    <div key="line1">
      {`${t('the_account')} `}
      <Account account={tx.Account} />
      {` ${t('create_payment_channel')} `}
      <Account account={tx.Destination} />
      {tx.DestinationTag && (
        <span className="dt">{` (${t('destination_tag')}: ${
          tx.DestinationTag
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

  if (tx.SourceTag) {
    lines.push(
      <div key="line_2">
        {t('the_source_tag_is')}
        <b> {tx.SourceTag}</b>
      </div>,
    )
  }

  lines.push(
    <div key="line3">
      {t('the_channel_amount_is')}{' '}
      <b>
        <Amount value={tx.Amount} />
      </b>
    </div>,
  )

  if (tx.SettleDelay) {
    lines.push(
      <div key="line4">
        {t('channel_settle_delay')}{' '}
        <b>
          {localizeNumber(tx.SettleDelay, language)} {t('seconds')}
        </b>
      </div>,
    )
  }

  if (tx.CancelAfter) {
    lines.push(
      <div key="line6">
        {t('describe_cancel_after')}
        <span className="time">{` ${cancelAfter} ${DATE_OPTIONS.timeZone}`}</span>
      </div>,
    )
  }

  return <>{lines}</>
}
