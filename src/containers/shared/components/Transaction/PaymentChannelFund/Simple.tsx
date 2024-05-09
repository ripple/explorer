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
        <SimpleRow label={t('channel_amount_increase')} data-testid="increase">
          <Amount modifier="+" value={increase} />
        </SimpleRow>
      )}
      {channelAmount && (
        <SimpleRow label={t('channel_amount')} data-testid="amount">
          <Amount value={channelAmount} />
        </SimpleRow>
      )}
      {totalClaimed && (
        <SimpleRow label={t('total_claimed')} data-testid="total">
          <Amount value={totalClaimed} />
        </SimpleRow>
      )}
      {source && (
        <SimpleRow label={t('source')} data-testid="source">
          <Account account={source} />
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow label={t('destination')} data-testid="destination">
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
