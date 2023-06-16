import { useTranslation } from 'react-i18next'
import type { AccountDelete } from 'xrpl'

import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { Account } from '../../Account'

export const Simple = ({ data }: TransactionSimpleProps<AccountDelete>) => {
  const { t } = useTranslation()
  const tx = data.instructions

  return (
    <SimpleRow label={t('destination')}>
      <Account account={tx.Destination} />
      {tx.DestinationTag && <span className="dt">:{tx.DestinationTag}</span>}
    </SimpleRow>
  )
}
