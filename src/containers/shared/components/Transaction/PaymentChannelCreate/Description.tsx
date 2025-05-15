import { useTranslation } from 'react-i18next'
import type { PaymentChannelCreate } from 'xrpl'
import { localizeDate, localizeNumber } from '../../../utils'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'
import { DATE_OPTIONS, findNode } from '../../../transactionUtils'
import { Account } from '../../Account'
import { useLanguage } from '../../../hooks'
import { TransactionDescriptionProps } from '../types'
import { Amount } from '../../Amount'

export const Description = ({
  data,
}: TransactionDescriptionProps<PaymentChannelCreate>) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { tx } = data
  const cancelAfter =
    tx.CancelAfter &&
    localizeDate(convertRippleDate(tx.CancelAfter), language, DATE_OPTIONS)

  const node = findNode(data.meta, 'CreatedNode', 'PayChannel')

  return (
    <>
      <div data-testid="accounts-line">
        {`${t('the_account')} `}
        <Account account={tx.Account} tag={tx.SourceTag} />
        {` ${t('create_payment_channel')} `}
        <Account account={tx.Destination} tag={tx.DestinationTag} />
      </div>
      {node && (
        <div data-testid="channel-line">
          {t('the_channel_id_is')}
          <span className="channel"> {node.LedgerIndex}</span>
        </div>
      )}
      <div data-testid="amount-line">
        {t('the_channel_amount_is')}{' '}
        <b>
          <Amount value={tx.Amount} />
        </b>
      </div>
      {tx.SettleDelay && (
        <div data-testid="delay-line">
          {t('channel_settle_delay')}{' '}
          <b>
            {localizeNumber(tx.SettleDelay, language)} {t('seconds')}
          </b>
        </div>
      )}
      {tx.CancelAfter && (
        <div data-testid="cancel-line">
          {t('describe_cancel_after')}
          <span className="time">{` ${cancelAfter} ${DATE_OPTIONS.timeZone}`}</span>
        </div>
      )}
    </>
  )
}
