import { useTranslation, Trans } from 'react-i18next'
import type { AccountSet } from 'xrpl'
import { ACCOUNT_FLAGS } from '../../../transactionUtils'
import DomainLink from '../../DomainLink'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'

export const Description = ({
  data,
}: TransactionDescriptionProps<AccountSet>) => {
  const { t } = useTranslation()
  const { tx } = data

  return (
    <>
      {tx.Domain && (
        <div data-testid="domain">
          {t('set_domain_description')} <DomainLink decode domain={tx.Domain} />
        </div>
      )}
      {tx.EmailHash && (
        <div data-testid="email">
          {t('set_email_description')}
          <span className="email"> {tx.EmailHash}</span>
        </div>
      )}
      {tx.MessageKey && (
        <div data-testid="message-key">
          {t('set_message_key_description')}
          <span className="message-key"> {tx.MessageKey}</span>
        </div>
      )}
      {tx.SetFlag && (
        <div data-testid="set-flag">
          {t('set_flag_description')}
          <span className="flag">
            {' '}
            {ACCOUNT_FLAGS[tx.SetFlag] || tx.SetFlag}
          </span>
        </div>
      )}
      {tx.ClearFlag && (
        <div data-testid="clear-flag">
          {t('clear_flag_description')}
          <span className="flag">
            {' '}
            {ACCOUNT_FLAGS[tx.ClearFlag] || tx.ClearFlag}
          </span>
        </div>
      )}
      {tx.NFTokenMinter && (
        <div data-testid="minter">
          <Trans i18nKey="set_nftoken_minter_description">
            <Account account={tx.NFTokenMinter} />
          </Trans>
        </div>
      )}
    </>
  )
}
