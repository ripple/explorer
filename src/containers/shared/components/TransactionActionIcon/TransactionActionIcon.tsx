import { ReactElement } from 'react'
import { TransactionAction } from '../Transaction/types'
import { getAction } from '../Transaction'
import TransactionCancelIcon from './TransactionCancelIcon.svg'
import TransactionCreateIcon from './TransactionCreateIcon.svg'
import TransactionFinishIcon from './TransactionFinishIcon.svg'
import TransactionModifyIcon from './TransactionModifyIcon.svg'
import TransactionSendIcon from './TransactionSendIcon.svg'
import TransactionUnknownIcon from './TransactionUnknownIcon.svg'

export interface TransactionActionIconProps {
  action?: TransactionAction
  type?: string
}

export const TransactionActionIcon = ({
  action,
  type,
}: TransactionActionIconProps) => {
  const icons: Record<string, ReactElement> = {
    [TransactionAction.CANCEL]: <TransactionCancelIcon />,
    [TransactionAction.CREATE]: <TransactionCreateIcon />,
    [TransactionAction.FINISH]: <TransactionFinishIcon />,
    [TransactionAction.MODIFY]: <TransactionModifyIcon />,
    [TransactionAction.SEND]: <TransactionSendIcon />,
    [TransactionAction.UNKNOWN]: <TransactionUnknownIcon />,
  }

  let icon = type && icons[getAction(type)]

  if (action) {
    icon = icons[action]
  }

  return icon || icons[TransactionAction.UNKNOWN]
}
