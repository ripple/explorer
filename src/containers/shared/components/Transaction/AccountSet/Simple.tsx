import { useTranslation } from 'react-i18next'
import type { AccountSet } from 'xrpl'
import { ACCOUNT_FLAGS } from '../../../transactionUtils'
import DomainLink from '../../DomainLink'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'

export const Simple = ({ data }: TransactionSimpleProps<AccountSet>) => {
  const { t } = useTranslation()
  const tx = data.instructions

  return (
    <>
      {tx.Domain && (
        <SimpleRow label={t('domain')} data-testid="domain">
          <DomainLink decode domain={tx.Domain} />
        </SimpleRow>
      )}
      {tx.EmailHash && (
        <SimpleRow label={t('email_hash')} data-testid="email">
          {tx.EmailHash}
        </SimpleRow>
      )}
      {tx.MessageKey && (
        <SimpleRow label={t('message_key')} data-testid="message">
          {tx.MessageKey}
        </SimpleRow>
      )}
      {tx.SetFlag && (
        <SimpleRow
          label={t('set_flag')}
          className="flag"
          data-testid="set-flag"
        >
          {ACCOUNT_FLAGS[tx.SetFlag] || tx.SetFlag}
        </SimpleRow>
      )}
      {tx.ClearFlag && (
        <SimpleRow
          label={t('clear_flag')}
          className="flag"
          data-testid="clear-flag"
        >
          {ACCOUNT_FLAGS[tx.ClearFlag] || tx.ClearFlag}
        </SimpleRow>
      )}
      {tx.NFTokenMinter && (
        <SimpleRow label={t('nftoken_minter')} data-testid="minter">
          <Account account={tx.NFTokenMinter} />
        </SimpleRow>
      )}
    </>
  )
}
