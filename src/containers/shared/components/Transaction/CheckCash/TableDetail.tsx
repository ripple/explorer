import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { parser } from './parser'
import { shortenCheckID } from '../../../utils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<ReturnType<typeof parser>>) => {
  const { t } = useTranslation()
  const {
    CheckID: checkID,
    Amount: amount,
    DeliverMin: deliverMin,
    delivered,
  } = instructions

  return (
    <div className="check-cash">
      {amount && (
        <>
          <span className="label">{t('amount')}</span>
          <Amount value={formatAmount(amount)} />
        </>
      )}
      {deliverMin && (
        <>
          <span className="label">{t('deliver_min')}</span>
          <Amount value={formatAmount(deliverMin)} />
        </>
      )}
      {delivered && (
        <>
          <span className="label">{t('delivered')}</span>
          <Amount value={formatAmount(delivered)} />
        </>
      )}
      <span className="label">{t('check_id')}</span>
      <span className="case-sensitive">
        <b>{shortenCheckID(checkID)}</b>
      </span>
    </div>
  )
}
