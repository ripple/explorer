import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { shortenEncryptionKey } from '../../../utils'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { amount, holderEncryptionKey } = instructions

  return (
    <div className="confidential-mpt-convert">
      <span className="label">{t('convert')}</span> <Amount value={amount} />
      {holderEncryptionKey && (
        <div>
          <span className="label">{t('holder_encryption_key')}: </span>
          <span>{shortenEncryptionKey(holderEncryptionKey)}</span>
        </div>
      )}
    </div>
  )
}
