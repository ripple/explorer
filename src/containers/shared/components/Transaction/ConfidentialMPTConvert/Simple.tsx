import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Amount } from '../../Amount'
import { shortenEncryptionKey } from '../../../utils'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { amount, holderEncryptionKey } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('convert')} data-testid="convert">
        <Amount value={amount} />
      </SimpleRow>
      {holderEncryptionKey && (
        <SimpleRow
          label={t('holder_encryption_key')}
          data-testid="holder-encryption-key"
        >
          {shortenEncryptionKey(holderEncryptionKey)}
        </SimpleRow>
      )}
    </>
  )
}
