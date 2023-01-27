import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { PaymentChannelCreateInstructions } from './types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PaymentChannelCreateInstructions>) => {
  const { t } = useTranslation()
  const { amount, source, destination } = instructions

  return (
    <div className="paymentChannelCreate">
      <div data-test="source">
        <span className="label">{t('source')}</span>
        <Account account={source} />
      </div>
      <div data-test="destination">
        <span className="label">{t('destination')}</span>
        <Account account={destination} />
      </div>
      <div data-test="amount">
        <span className="label">{t('channel_amount')}</span>
        <Amount value={amount} />
      </div>
    </div>
  )
}
