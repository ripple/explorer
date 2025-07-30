import { Trans } from 'react-i18next'
import { t } from 'i18next'
import { TransactionTableDetailProps } from '../types'
import { VaultCreate } from './types'
import Currency from '../../Currency'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultCreate>) => {
  const { Asset: asset } = instructions
  return (
    <div className="vault-create">
      <span className="label">{t('transaction_action_CREATE')}</span>
      <Trans
        i18nKey="vault_create_table_detail"
        components={{
          Asset: <Currency currency={asset.currency} issuer={asset.issuer} />,
        }}
      />
    </div>
  )
}
