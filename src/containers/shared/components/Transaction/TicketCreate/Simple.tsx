import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { data } = props
  const { ticketCount } = data.instructions

  return (
    <>
      <div className="row">
        <div className="label ticket-count">{t('ticket_count')}</div>
        <div className="value">{ticketCount}</div>
      </div>
    </>
  )
}

export { Simple }
