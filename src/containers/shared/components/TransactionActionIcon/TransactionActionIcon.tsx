import React, { ReactElement } from 'react'
import { TransactionAction } from '../Transaction/types'
import { getAction } from '../Transaction'
import { ReactComponent as TransactionCancelIcon } from './TransactionCancelIcon.svg'
import { ReactComponent as TransactionCreateIcon } from './TransactionCreateIcon.svg'
import { ReactComponent as TransactionFinishIcon } from './TransactionFinishIcon.svg'
import { ReactComponent as TransactionModifyIcon } from './TransactionModifyIcon.svg'
import { ReactComponent as TransactionSendIcon } from './TransactionSendIcon.svg'
import { ReactComponent as TransactionUnknownIcon } from './TransactionUnknownIcon.svg'

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
