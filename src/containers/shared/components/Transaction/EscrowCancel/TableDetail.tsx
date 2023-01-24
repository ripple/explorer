import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { owner, sequence, ticketSequence } = instructions
  return (
    <div className="escrow">
      {owner && (
        <>
          <span className="label">{t('cancel_escrow')}</span>{' '}
          <Account account={owner} />
          <span>
            {' '}
            - {sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}
          </span>
        </>
      )}
    </div>
  )
}
