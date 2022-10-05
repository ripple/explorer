import React from 'react'
import { useTranslation } from 'react-i18next'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { ticketCount } = instructions
  return (
    <div className="ticketCreate">
      <span className="label">{t('ticket_count')}:</span>
      <span> </span>
      <span>{ticketCount}</span>
    </div>
  )
}
