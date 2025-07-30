import { t } from 'i18next'
import { TransactionTableDetailProps } from '../types'
import { VaultSet } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultSet>) => {
  const {
    VaultID: vaultId,
    Data: data,
    AssetsMaximum: assetsMaximum,
    DomainID: domainId,
  } = instructions
  return (
    <>
      <div className="vault-id">
        <span className="label">{t('vault_id')}: </span>
        <span className="case-sensitive">{vaultId}</span>
      </div>
      <>
        {data && (
          <>
            <span className="label">{t('data')}: </span>
            <span className="case-sensitive">{data}</span>
          </>
        )}
        {assetsMaximum && (
          <>
            <span className="label">{t('assets_maximum')}: </span>
            <span className="case-sensitive">{assetsMaximum}</span>
          </>
        )}
        {domainId && (
          <>
            <span className="label">{t('domain_id')}: </span>
            <span className="case-sensitive">{domainId}</span>
          </>
        )}
      </>
    </>
  )
}
