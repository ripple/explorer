import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { TransactionSimpleProps } from '../types'
import { PaymentChannelClaimInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<PaymentChannelClaimInstructions>) => {
  const { t } = useTranslation()
  const {
    channelAmount,
    claimed,
    totalClaimed,
    source = '',
    destination = '',
    channel,
    renew,
    close,
    deleted,
  } = data.instructions
  const dParts = destination.split(':')
  const sParts = source.split(':')

  return (
    <>
      {channelAmount && (
        <SimpleRow label={t('channel_amount')} data-testid="amount">
          <Amount value={channelAmount} />
        </SimpleRow>
      )}
      {claimed && (
        <SimpleRow label={t('amount_claimed')} data-testid="claimed">
          <Amount value={claimed} />
        </SimpleRow>
      )}
      {totalClaimed && (
        <SimpleRow label={t('total_claimed')} data-testid="total">
          <Amount value={totalClaimed} />
        </SimpleRow>
      )}
      {source && (
        <SimpleRow label={t('source')} data-testid="source">
          <Account account={sParts[0]} />
          {sParts[1] && <span className="dt">:{sParts[1]}</span>}
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow label={t('destination')} data-testid="destination">
          <Account account={dParts[0]} />
          {dParts[1] && <span className="dt">:{dParts[1]}</span>}
        </SimpleRow>
      )}
      {channel && (
        <SimpleRow label={t('channel_id')} className="channel">
          {channel}
        </SimpleRow>
      )}
      {renew && (
        <SimpleRow label="" className="flag" data-testid="renew">
          {t('renew_channel')}
        </SimpleRow>
      )}
      {close && (
        <SimpleRow label="" className="flag" data-testid="close-request">
          {t('close_request')}
        </SimpleRow>
      )}
      {deleted && (
        <SimpleRow label="" className="closed" data-testid="closed">
          {t('payment_channel_closed')}
        </SimpleRow>
      )}
    </>
  )
}
