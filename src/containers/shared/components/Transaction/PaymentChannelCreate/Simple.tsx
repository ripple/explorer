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

  return (
    <>
      <SimpleRow label={t('amount')} data-test="amount">
        <Amount value={amount} />
      </SimpleRow>
      <SimpleRow label={t('source')} data-test="source">
        <Account account={source} />
      </SimpleRow>
      <SimpleRow label={t('destination')} data-test="destination">
        <Account account={destination} />
      </SimpleRow>
      {delay && (
        <SimpleRow label={t('settle_delay')} data-test="delay">
          {localizeNumber(delay, language)} {t('seconds_short')}
        </SimpleRow>
      )}
      {cancelAfter && (
        <SimpleRow label={t('cancel_after')} data-test="cancel-after">
          {localizeDate(new Date(cancelAfter), language, DATE_OPTIONS)}{' '}
          {DATE_OPTIONS.timeZone}
        </SimpleRow>
      )}
      {channel && (
        <SimpleRow label={t('channel_id')} className="channel">
          {channel}
        </SimpleRow>
      )}
    </>
  )
}
