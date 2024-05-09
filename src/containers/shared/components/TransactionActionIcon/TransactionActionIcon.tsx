import { ReactElement } from 'react'
import { TransactionAction } from '../Transaction/types'
import { getAction } from '../Transaction'
import TransactionCancelIcon from './TransactionCancelIcon.svg'
import TransactionCreateIcon from './TransactionCreateIcon.svg'
import TransactionFinishIcon from './TransactionFinishIcon.svg'
import TransactionModifyIcon from './TransactionModifyIcon.svg'
import TransactionSendIcon from './TransactionSendIcon.svg'
import TransactionUnknownIcon from './TransactionUnknownIcon.svg'

export type TransactionActionIconProps =
  | { action: TransactionAction; type?: never }
  | { action?: never; type: string }

export const TransactionActionIcon = ({
  action,
  type,
}: TransactionActionIconProps) => {
  const icons: Record<TransactionAction, ReactElement> = {
    [TransactionAction.CANCEL]: <TransactionCancelIcon title="tx-cancel" />,
    [TransactionAction.CREATE]: <TransactionCreateIcon title="tx-create" />,
    [TransactionAction.FINISH]: <TransactionFinishIcon title="tx-finish" />,
    [TransactionAction.MODIFY]: <TransactionModifyIcon title="tx-modify" />,
    [TransactionAction.SEND]: <TransactionSendIcon title="tx-send" />,
    [TransactionAction.UNKNOWN]: <TransactionUnknownIcon title="tx-unknown" />,
  }

  let icon = type && icons[getAction(type)]

  if (action) {
    icon = icons[action]
  }

  return icon || icons[TransactionAction.UNKNOWN]
}
