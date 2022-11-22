import React from 'react'
import { useTranslation } from 'react-i18next'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { localizeNumber, localizeDate } from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { useLanguage } from '../../../hooks'
import { TransactionSimpleProps } from '../types'
import { PaymentChannelCreateInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<PaymentChannelCreateInstructions>) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { amount, source, destination, delay, cancelAfter, channel } =
    data.instructions
  const caDate = localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS)
  const sParts = source.split(':')

  return (
    <>
      <SimpleRow label={t('amount')}>
        <Amount value={amount} />
      </SimpleRow>
      {sParts[1] && <SimpleRow label={t('source_tag')}>{sParts[1]}</SimpleRow>}
      <SimpleRow label={t('destination')}>
        <Account account={destination} />
      </SimpleRow>
      {delay && (
        <SimpleRow label={t('settle_delay')}>
          {localizeNumber(delay, language)} {t('seconds_short')}
        </SimpleRow>
      )}
      {cancelAfter && (
        <SimpleRow label={t('cancel_after')}>
          {caDate} {DATE_OPTIONS.timeZone}
        </SimpleRow>
      )}
      {channel && (
        <SimpleRow label={t('channel_id')} className=".channel">
          {channel}
        </SimpleRow>
      )}
    </>
  )
}
