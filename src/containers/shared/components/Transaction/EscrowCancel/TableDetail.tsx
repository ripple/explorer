import React from 'react'
import { useTranslation } from 'react-i18next'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { owner, sequence, ticketSequence } = instructions
  return (
    <div className="escrow">
      {owner && (
        <div>
          <span className="label">{t('cancel_escrow')}</span>
          <span className="account">{owner}</span>
          <span>
            -{sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}
          </span>
        </div>
      )}
    </div>
  )
}
