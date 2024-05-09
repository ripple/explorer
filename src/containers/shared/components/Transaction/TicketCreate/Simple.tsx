import { useTranslation } from 'react-i18next'
import type { TicketCreate } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<TicketCreate>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { TicketCount } = data.instructions

  return (
    <SimpleRow label={t('ticket_count')} data-testid="ticket-count">
      {TicketCount}
    </SimpleRow>
  )
}

export { Simple }
