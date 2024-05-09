import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { ACCOUNT_ZERO } from '../transactionUtils'

interface SequenceProps {
  addContextHelp?: boolean
  sequence?: number
  ticketSequence?: number
  account?: string
  isHook?: boolean
}

export const Sequence: FC<SequenceProps> = ({
  addContextHelp = false,
  sequence = 0,
  ticketSequence = 0,
  account = '',
  isHook = false,
}) => {
  const { t } = useTranslation()
  const isPseudoTransaction = account === ACCOUNT_ZERO || account === ''

  function getContext() {
    if (isHook) {
      return addContextHelp === true ? t('hook_emitted') : t('hook')
    }
    return addContextHelp === true ? t('ticket_used') : t('ticket')
  }

  return (
    <span>
      {sequence === 0 && !isPseudoTransaction ? (
        <span className="row" data-testid="sequence">
          {ticketSequence}
          {' ('}
          {getContext()})
        </span>
      ) : (
        sequence
      )}
    </span>
  )
}
