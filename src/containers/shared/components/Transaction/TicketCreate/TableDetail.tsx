import { useTranslation } from 'react-i18next'
import { TicketCreate } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<TicketCreate>) => {
  const { t } = useTranslation()
  const { TicketCount } = instructions
  return (
    <div className="ticketCreate">
      <span className="label">{t('ticket_count')}: </span>
      <span>{TicketCount}</span>
    </div>
  )
}
