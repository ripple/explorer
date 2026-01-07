import { useTranslation } from 'react-i18next'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { Account } from '../../shared/components/Account'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { RouteLink } from '../../shared/routing'
import { MPT_ROUTE } from '../../App/routes'
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
}

// Vault flags from XLS-65d spec
const VAULT_FLAGS = {
  lsfPrivate: 0x00000001,
}

// Withdrawal policy values from XLS-65d spec
const WITHDRAWAL_POLICIES: { [key: number]: string } = {
  0: 'stranded',
  1: 'first_come_first_served',
}

const formatAsset = (asset: VaultData['Asset']): string => {
  if (!asset) return '-'
  if (asset.currency === 'XRP') return 'XRP'
  return asset.currency
}

const formatAmount = (
  amount: string | undefined,
  asset: VaultData['Asset'],
  language: string,
): string => {
  if (!amount) return '-'
  const num = Number(amount)
  if (Number.isNaN(num)) return amount
  const formatted = localizeNumber(num, language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
  const currency = asset?.currency === 'XRP' ? 'XRP' : asset?.currency || ''
  return `${formatted} ${currency}`
}

// Decode the Data field from hex to UTF-8 if needed
const decodeVaultData = (data: string | undefined): string | undefined => {
  if (!data) return undefined

  // Try to decode hex string to UTF-8
  if (/^[0-9A-Fa-f]+$/.test(data)) {
    try {
      return Buffer.from(data, 'hex').toString('utf8')
    } catch {
      return data
    }
  }

  return data
}

export const Details = ({ data, vaultId }: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const {
    Owner: owner,
    Asset: asset,
    AssetsTotal: assetsTotal,
    AssetsAvailable: assetsAvailable,
    AssetsMaximum: assetsMaximum,
    MPTIssuanceID: mptIssuanceId,
    Flags: flags,
    LossUnrealized: lossUnrealized,
    WithdrawalPolicy: withdrawalPolicy,
    Data: vaultDataRaw,
  } = data

  const isPrivate =
    flags !== undefined && (flags & VAULT_FLAGS.lsfPrivate) !== 0

  const decodedData = decodeVaultData(vaultDataRaw)

  const getWithdrawalPolicyText = () => {
    if (withdrawalPolicy === undefined) return '-'
    const policyKey = WITHDRAWAL_POLICIES[withdrawalPolicy]
    if (!policyKey) return String(withdrawalPolicy)
    // Use type assertion for dynamic translation keys
    return t(policyKey as 'stranded' | 'first_come_first_served')
  }

  const renderMPTSharesLink = () => {
    if (!mptIssuanceId) return '-'
    const truncatedId = `${mptIssuanceId.substring(0, 8)}...${mptIssuanceId.substring(mptIssuanceId.length - 6)}`
    return (
      <RouteLink to={MPT_ROUTE} params={{ id: mptIssuanceId }}>
        {truncatedId}
      </RouteLink>
    )
  }

  return (
    <div className="vault-details-container">
      <div className="details-column">
        <table className="token-table">
          <tbody>
            <TokenTableRow label={t('vault_id')} value={vaultId} />
            {owner && (
              <TokenTableRow
                label={t('owner')}
                value={<Account account={owner} />}
              />
            )}
            <TokenTableRow
              label={t('private_vault')}
              value={isPrivate ? t('yes') : t('no')}
            />
            <TokenTableRow
              label={t('data')}
              value={decodedData || t('not_available')}
            />
            <TokenTableRow
              label={t('withdrawal_policy')}
              value={getWithdrawalPolicyText()}
            />
          </tbody>
        </table>
      </div>
      <div className="details-column">
        <table className="token-table">
          <tbody>
            <TokenTableRow label={t('asset')} value={formatAsset(asset)} />
            <TokenTableRow
              label={t('total_value_locked')}
              value={formatAmount(assetsTotal, asset, language)}
            />
            <TokenTableRow
              label={t('max_total_supply')}
              value={formatAmount(assetsMaximum, asset, language)}
            />
            <TokenTableRow
              label={t('mpt_shares')}
              value={renderMPTSharesLink()}
            />
            <TokenTableRow
              label={t('available_to_borrow')}
              value={formatAmount(assetsAvailable, asset, language)}
            />
            <TokenTableRow
              label={t('unrealized_loss')}
              value={formatAmount(lossUnrealized, asset, language)}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}
