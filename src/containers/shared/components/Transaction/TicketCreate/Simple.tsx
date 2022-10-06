import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { data } = props
  const { ticketCount } = data.instructions

  return (
    <>
      <SimpleRow label={t('ticket_count')} data-test="ticket-count">
        {ticketCount}
      </SimpleRow>
    </>
  )
}

export { Simple }
