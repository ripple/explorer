import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { parser } from './parser'
import { shortenCheckID } from '../../../utils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<ReturnType<typeof parser>>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    CheckID: checkID,
    Amount: amount,
    DeliverMin: deliverMin,
    delivered,
  } = data.instructions

  return (
    <>
      {amount && (
        <SimpleRow label={t('amount')} data-testid="cash-amount">
          <Amount value={formatAmount(amount)} />
        </SimpleRow>
      )}
      {deliverMin && (
        <SimpleRow label={t('deliver_min')} data-testid="deliver-min">
          <Amount value={formatAmount(deliverMin)} />
        </SimpleRow>
      )}
      {delivered && (
        <SimpleRow label={t('delivered')} data-testid="delivered">
          <Amount value={formatAmount(delivered)} />
        </SimpleRow>
      )}
      <SimpleRow label={t('check_id')} data-testid="check-id">
        {shortenCheckID(checkID)}
      </SimpleRow>
    </>
  )
}
