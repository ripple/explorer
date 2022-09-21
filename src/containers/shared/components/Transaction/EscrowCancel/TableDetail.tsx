import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { owner, sequence, ticketSequence } = instructions
  return (
    <div className="escrow">
      {owner && (
        <Trans i18nKey="cancel_escrow">
          <span className="label">{t('cancel_escrow')}</span>
          <span className="account">{owner}</span>
          <span>
            -{sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}
          </span>
        </Trans>
      )}
    </div>
  )
}
