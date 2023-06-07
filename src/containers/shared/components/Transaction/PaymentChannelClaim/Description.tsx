import { useTranslation } from 'react-i18next'
import { findNode, normalizeAmount } from '../../../transactionUtils'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { PaymentChannelClaim } from './types'
import { useLanguage } from '../../../hooks'

export function Description({
  data,
}: TransactionDescriptionProps<PaymentChannelClaim>) {
  const { t } = useTranslation()
  const language = useLanguage()
  const deleted = findNode(data, 'DeletedNode', 'PayChannel')
  const modified = findNode(data, 'ModifiedNode', 'PayChannel')
  const node = deleted || modified
  const change =
    node && node.PreviousFields && node.PreviousFields.Balance
      ? node.FinalFields.Balance - node.PreviousFields.Balance
      : null

  return (
    <>
      <div data-test="account-line">
        {t('transaction_initiated_by')} <Account account={data.tx.Account} />
      </div>
      <div data-test="channel-line">
        {t('update_payment_channel')}{' '}
        <span className="channel">{data.tx.Channel}</span>
      </div>
      {data.tx.Balance && (
        <div data-test="balance-line">
          {t('the_channel_balance_is')}
          <b>
            {' '}
            {normalizeAmount(data.tx.Balance, language)}
            <small>XRP</small>
          </b>
          {change && (
            <span>
              {' ('}
              {t('increased_by')}
              <b>
                {' '}
                {normalizeAmount(change, language)}
                <small>XRP</small>
              </b>
              )
            </span>
          )}
        </div>
      )}
      {deleted && (
        <div data-test="closed-line">
          {t('payment_channel_closed_description')}
        </div>
      )}
    </>
  )
}
