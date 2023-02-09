import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionSimpleProps } from '../types'
import { PaymentChannelFundInstructions } from './types'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'

export const Simple = ({
  data,
}: TransactionSimpleProps<PaymentChannelFundInstructions>) => {
  const { t } = useTranslation()
  const {
    channelAmount,
    increase,
    totalClaimed,
    source = '',
    destination = '',
    channel,
  } = data.instructions

  return (
    <>
      {increase && (
        <SimpleRow label={t('channel_amount_increase')} data-test="increase">
          <Amount modifier="+" value={increase} />
        </SimpleRow>
      )}
      {channelAmount && (
        <SimpleRow label={t('channel_amount')} data-test="amount">
          <Amount value={channelAmount} />
        </SimpleRow>
      )}
      {totalClaimed && (
        <SimpleRow label={t('total_claimed')} data-test="total">
          <Amount value={totalClaimed} />
        </SimpleRow>
      )}
      {source && (
        <SimpleRow label={t('source')} data-test="source">
          <Account account={source} />
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow label={t('destination')} data-test="destination">
          <Account account={destination} />
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
