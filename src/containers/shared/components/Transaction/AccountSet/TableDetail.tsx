import { useTranslation } from 'react-i18next'
import { ACCOUNT_FLAGS, decodeHex } from '../../../transactionUtils'
import { Account } from '../../Account'
import { AccountSet } from './types'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps<AccountSet>) => {
  const { t } = useTranslation()

  return (
    <>
      {tx.Domain && (
        <div data-test="domain">
          <span className="label">{t('domain')}:</span>{' '}
          <span className="domain">{decodeHex(tx.Domain)}</span>
        </div>
      )}
      {tx.EmailHash && (
        <div data-test="email">
          <span className="label">{t('email_hash')}:</span>{' '}
          <span className="email-hash">{tx.EmailHash}</span>
        </div>
      )}
      {tx.MessageKey && (
        <div data-test="message">
          <span className="label">{t('message_key')}:</span>{' '}
          <span className="message-key">{tx.MessageKey}</span>
        </div>
      )}
      {tx.SetFlag && (
        <div data-test="set-flag">
          <span className="label">{t('set_flag')}:</span>{' '}
          <span className="flag">
            {ACCOUNT_FLAGS[Number(tx.SetFlag)] || tx.SetFlag}
          </span>
        </div>
      )}
      {tx.ClearFlag && (
        <div data-test="clear-flag">
          <span className="label">{t('clear_flag')}:</span>{' '}
          <span className="flag">
            {ACCOUNT_FLAGS[Number(tx.ClearFlag)] || tx.ClearFlag}
          </span>
        </div>
      )}
      {tx.NFTokenMinter && (
        <div data-test="minter">
          <span className="label">{t('nftoken_minter')}:</span>{' '}
          <span className="domain">
            <Account account={tx.NFTokenMinter} />
          </span>
        </div>
      )}
    </>
  )
}
