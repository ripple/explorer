import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Sequence } from '../../Sequence'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { owner, sequence, ticketSequence } = instructions
  return (
    <div className="escrow">
      {owner && (
        <>
          <span className="label">{t('cancel_escrow')}</span>{' '}
          <Account account={owner} /> -{' '}
          <Sequence
            sequence={sequence}
            ticketSequence={ticketSequence}
            account={owner}
          />
        </>
      )}
    </div>
  )
}
