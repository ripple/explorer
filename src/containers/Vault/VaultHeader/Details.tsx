import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { Account } from '../../shared/components/Account'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { RouteLink } from '../../shared/routing'
import { MPT_ROUTE } from '../../App/routes'
import SocketContext from '../../shared/SocketContext'
import { getLedgerEntry } from '../../../rippled/lib/rippled'
import './styles.scss'

interface VaultData {
  Owner?: string
  Asset?: {
    currency: string
    issuer?: string
    mpt_issuance_id?: string
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
  ShareMPTID?: string
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
  1: 'first_come_first_served',
}

const formatAsset = (asset: VaultData['Asset']): string | React.ReactNode => {
  if (!asset) return '-'
  if (asset.currency === 'XRP') return 'XRP'
  if (asset.mpt_issuance_id) {
    const truncatedId = `${asset.mpt_issuance_id.substring(0, 8)}...${asset.mpt_issuance_id.substring(asset.mpt_issuance_id.length - 6)}`
    return (
      <RouteLink to={MPT_ROUTE} params={{ id: asset.mpt_issuance_id }}>
        {truncatedId}
      </RouteLink>
    )
  }
  return asset.currency
}

/**
 * Format large numbers with K (thousands) or M (millions) suffixes
 * e.g., 12500000 -> "12.5M", 200000 -> "200K"
 */
const formatCompactAmount = (
  amount: string | undefined,
  asset: VaultData['Asset'],
  language: string,
): string => {
  if (!amount) return '-'
  const num = Number(amount)
  if (Number.isNaN(num)) return amount

  const currency = asset?.currency === 'XRP' ? 'XRP' : asset?.currency || ''

  let formattedNum: string
  if (num >= 1_000_000) {
    const millions = num / 1_000_000
    formattedNum = `${localizeNumber(millions, language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}M`
  } else if (num >= 1_000) {
    const thousands = num / 1_000
    formattedNum = `${localizeNumber(thousands, language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}K`
  } else {
    formattedNum = String(localizeNumber(num, language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }))
  }

  return `${formattedNum} ${currency}`
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
  const rippledSocket = useContext(SocketContext)

  const {
    Owner: owner,
    Asset: asset,
    AssetsTotal: assetsTotal,
    AssetsAvailable: assetsAvailable,
    AssetsMaximum: assetsMaximum,
    Flags: flags,
    LossUnrealized: lossUnrealized,
    WithdrawalPolicy: withdrawalPolicy,
    Data: vaultDataRaw,
    ShareMPTID: vaultShareMptId,
  } = data

  // Fetch MPTokenIssuance to get the DomainID (vault credential)
  const { data: mptIssuanceData } = useQuery(
    ['getMPTIssuance', vaultShareMptId],
    async () => {
      if (!vaultShareMptId) return null
      const resp = await getLedgerEntry(rippledSocket, { index: vaultShareMptId })
      return resp?.node
    },
    {
      enabled: !!vaultShareMptId,
    },
  )

  const vaultCredential = mptIssuanceData?.DomainID

  const isPrivate =
    flags !== undefined && (flags & VAULT_FLAGS.lsfPrivate) !== 0

  const decodedData = decodeVaultData(vaultDataRaw)

  const getWithdrawalPolicyText = () => {
    if (withdrawalPolicy === undefined) return '-'
    const policyKey = WITHDRAWAL_POLICIES[withdrawalPolicy]
    if (!policyKey) return String(withdrawalPolicy)
    // Use type assertion for dynamic translation keys
    return t(policyKey as 'first_come_first_served')
  }

  const renderMPTSharesLink = () => {
    if (!vaultShareMptId) return '-'
    const truncatedId = `${vaultShareMptId.substring(0, 8)}...${vaultShareMptId.substring(vaultShareMptId.length - 6)}`
    return (
      <RouteLink to={MPT_ROUTE} params={{ id: vaultShareMptId }}>
        {truncatedId}
      </RouteLink>
    )
  }

  return (
    <div className="vault-details-container">
      <div className="details-column">
        <table className="token-table">
          <tbody>
            <TokenTableRow
              label={t('vault_id')}
              value={
                <CopyableText
                  text={vaultId}
                  displayText={`${vaultId.substring(0, 8)}...${vaultId.substring(vaultId.length - 6)}`}
                  showCopyIcon
                />
              }
            />
            {owner && (
              <TokenTableRow
                label={t('owner')}
                value={<Account account={owner} />}
              />
            )}
            <TokenTableRow
              label={t('private_vault')}
              value={
                <div className="private-vault-toggle">
                  <span className={`toggle-pill ${isPrivate ? 'active' : ''}`}>
                    {t('yes')}
                  </span>
                  <span className={`toggle-pill ${!isPrivate ? 'active' : ''}`}>
                    {t('no')}
                  </span>
                </div>
              }
            />
            {vaultCredential && (
              <TokenTableRow
                label={t('perm_domain_id')}
                value={vaultCredential}
              />
            )}
            <TokenTableRow
              label={t('data')}
              value={decodedData || '-'}
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
              value={formatCompactAmount(assetsTotal, asset, language)}
            />
            <TokenTableRow
              label={t('max_total_supply')}
              value={assetsMaximum ? formatCompactAmount(assetsMaximum, asset, language) : t('no_limit')}
            />
            <TokenTableRow
              label={t('shares')}
              value={renderMPTSharesLink()}
            />
            <TokenTableRow
              label={t('available_to_borrow')}
              value={formatCompactAmount(assetsAvailable, asset, language)}
            />
            <TokenTableRow
              label={t('unrealized_loss')}
              value={formatCompactAmount(lossUnrealized, asset, language)}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}
