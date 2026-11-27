import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { parser } from './parser'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<ReturnType<typeof parser>>) => {
  const { t } = useTranslation()
  const {
    SendMax: sendMax,
    Destination: destination,
    DestinationTag: destinationTag,
  } = instructions
  const dt = destinationTag !== undefined ? `:${destinationTag}` : ''

  return (
    <div className="check-create">
      <span className="label">{t('max_amount')}</span>
      <Amount value={formatAmount(sendMax)} />
      <span>{t('to')}</span>
      <Account account={`${destination}${dt}`} />
    </div>
  )
}
