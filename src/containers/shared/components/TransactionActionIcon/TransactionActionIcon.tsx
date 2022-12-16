import React from 'react'
import { TransactionAction } from '../Transaction/types'
import { transactionTypes } from '../Transaction'
import { ReactComponent as TransactionCancelIcon } from './TransactionCancelIcon.svg'
import { ReactComponent as TransactionCreateIcon } from './TransactionCreateIcon.svg'
import { ReactComponent as TransactionFinishIcon } from './TransactionFinishIcon.svg'
import { ReactComponent as TransactionModifyIcon } from './TransactionModifyIcon.svg'
import { ReactComponent as TransactionSendIcon } from './TransactionSendIcon.svg'

export interface TransactionActionIcon {
  action?: TransactionAction
  type?: string
}

export const TransactionActionIcon = ({
  action,
  type,
}: TransactionActionIcon) => {
  const icons: Record<string, any> = {
    [TransactionAction.CANCEL]: <TransactionCancelIcon />,
    [TransactionAction.CREATE]: <TransactionCreateIcon />,
    [TransactionAction.FINISH]: <TransactionFinishIcon />,
    [TransactionAction.MODIFY]: <TransactionModifyIcon />,
    [TransactionAction.SEND]: <TransactionSendIcon />,
  }

  let icon = type && icons[transactionTypes[type].action]

  if (action) {
    icon = icons[action]
  }

  return icon
}
