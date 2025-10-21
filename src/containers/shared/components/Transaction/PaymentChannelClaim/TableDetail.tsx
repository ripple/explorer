import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { PaymentChannelClaimInstructions } from './types'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PaymentChannelClaimInstructions>) => {
  const { t } = useTranslation()
  const {
    source,
    destination,
    claimed,
    channelAmount,
    remaining,
    renew,
    close,
    deleted,
  } = instructions

  return (
    <div className="paymentChannelClaim">
      {source && (
        <div data-testid="source">
          <span className="label">{t('source')}</span>
          <span className="account">
            <Account account={source} />
          </span>
        </div>
      )}
      {destination && (
        <div data-testid="destination">
          <span className="label">{t('destination')}</span>
          <span className="account">
            <Account account={destination} />
          </span>
        </div>
      )}
      {claimed && (
        <div data-testid="claimed">
          <span className="label">{t('claimed')}</span>
          <Amount value={claimed} />
          {remaining && channelAmount && (
            <>
              {' '}
              (<Amount value={remaining} /> <span>{t('out_of')}</span>{' '}
              <Amount value={channelAmount} /> {t('remaining')})
            </>
          )}
        </div>
      )}
      {channelAmount && !claimed && (
        <div data-testid="channel-amount">
          <span className="label">{t('channel_amount')}</span>
          <Amount value={channelAmount} />
        </div>
      )}
      {renew && (
        <div className="flag" data-testid="renew">
          {t('renew_channel')}
        </div>
      )}
      {close && (
        <div className="flag" data-testid="close-request">
          {t('close_request')}
        </div>
      )}
      {deleted && (
        <div className="closed" data-testid="closed">
          {t('payment_channel_closed')}
        </div>
      )}
    </div>
  )
}
