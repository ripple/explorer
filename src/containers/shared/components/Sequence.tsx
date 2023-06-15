import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { ACCOUNT_ZERO } from '../transactionUtils'

interface SequenceProps {
  addContextHelp?: boolean
  sequence?: number
  ticketSequence?: number
  account?: string
}

export const Sequence: FC<SequenceProps> = ({
  addContextHelp = false,
  sequence = 0,
  ticketSequence = 0,
  account = '',
}) => {
  const { t } = useTranslation()
  const isPseudoTransaction = account === ACCOUNT_ZERO || account === ''

  return (
    <span>
      {sequence === 0 && !isPseudoTransaction ? (
        <span className="row">
          {ticketSequence}
          {' ('}
          {addContextHelp && addContextHelp === true
            ? t('ticket_used')
            : t('ticket')}
          )
        </span>
      ) : (
        sequence
      )}
    </span>
  )
}
