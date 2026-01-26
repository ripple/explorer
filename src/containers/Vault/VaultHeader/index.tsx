import { useTranslation } from 'react-i18next'
import { Details } from './Details'
import { DisplayCurrency } from '../CurrencyToggle'
import './styles.scss'

interface VaultData {
  Owner?: string
  Asset?: {
    currency: string
    issuer?: string
  }
  AssetsTotal?: string
  AssetsAvailable?: string
  AssetsMaximum?: string
  MPTIssuanceID?: string
  Flags?: number
  LossUnrealized?: string
  PseudoAccount?: string
  WithdrawalPolicy?: number
  Data?: string
}

interface Props {
  data: VaultData
  vaultId: string
  displayCurrency: DisplayCurrency
}

export const VaultHeader = ({ data, vaultId, displayCurrency }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="vault-section">
      <h2 className="vault-section-title">{t('vault')}</h2>
      <div className="vault-section-divider" />
      <Details
        data={data}
        vaultId={vaultId}
        displayCurrency={displayCurrency}
      />
    </div>
  )
}
