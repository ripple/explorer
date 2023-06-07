import { useTranslation } from 'react-i18next'
import { ACCOUNT_FLAGS } from '../../../transactionUtils'
import DomainLink from '../../DomainLink'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { AccountSet } from './types'

export function Simple({ data }: TransactionSimpleProps<AccountSet>) {
  const { t } = useTranslation()
  const tx = data.instructions

  return (
    <>
      {tx.Domain && (
        <SimpleRow label={t('domain')} data-test="domain">
          <DomainLink decode domain={tx.Domain} />
        </SimpleRow>
      )}
      {tx.EmailHash && (
        <SimpleRow label={t('email_hash')} data-test="email">
          {tx.EmailHash}
        </SimpleRow>
      )}
      {tx.MessageKey && (
        <SimpleRow label={t('message_key')} data-test="message">
          {tx.MessageKey}
        </SimpleRow>
      )}
      {tx.SetFlag && (
        <SimpleRow label={t('set_flag')} className="flag" data-test="set-flag">
          {ACCOUNT_FLAGS[tx.SetFlag] || tx.SetFlag}
        </SimpleRow>
      )}
      {tx.ClearFlag && (
        <SimpleRow
          label={t('clear_flag')}
          className="flag"
          data-test="clear-flag"
        >
          {ACCOUNT_FLAGS[tx.ClearFlag] || tx.ClearFlag}
        </SimpleRow>
      )}
      {tx.NFTokenMinter && (
        <SimpleRow label={t('nftoken_minter')} data-test="minter">
          <Account account={tx.NFTokenMinter} />
        </SimpleRow>
      )}
    </>
  )
}
