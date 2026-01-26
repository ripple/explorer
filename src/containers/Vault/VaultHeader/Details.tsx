import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { Account } from '../../shared/components/Account'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useLanguage } from '../../shared/hooks'
import { useXRPToUSDRate } from '../../shared/hooks/useXRPToUSDRate'
import { RouteLink } from '../../shared/routing'
import { MPT_ROUTE } from '../../App/routes'
import SocketContext from '../../shared/SocketContext'
import { getLedgerEntry } from '../../../rippled/lib/rippled'
import { decodeVaultData, formatCompactNumber } from '../utils'
import { DisplayCurrency } from '../CurrencyToggle'
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
  displayCurrency: DisplayCurrency
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

const getAssetCurrency = (asset: VaultData['Asset']): string =>
  asset?.currency === 'XRP' ? 'XRP' : asset?.currency || ''

export const Details = ({ data, vaultId, displayCurrency }: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const rippledSocket = useContext(SocketContext)
  const xrpToUsdRate = useXRPToUSDRate()

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

  // Supported USD conversion rates by currency
  // - XRP: Live exchange rate from oracle
  // - RLUSD: Stablecoin pegged 1:1 with USD
  // - Other currencies: No conversion available (returns undefined)
  const usdRates: Record<string, number> = {
    XRP: xrpToUsdRate,
    RLUSD: 1,
  }

  // Converts amount to USD if displayCurrency is 'usd', otherwise returns as-is
  const convertToDisplayCurrency = (
    amount: string | undefined,
  ): string | undefined => {
    if (!amount || displayCurrency === 'xrp') return amount

    const numAmount = Number(amount)
    if (Number.isNaN(numAmount)) return amount

    const rate = usdRates[asset?.currency ?? '']
    return rate !== undefined ? String(numAmount * rate) : undefined
  }

  // Returns 'USD' when showing USD values, otherwise the vault's asset currency
  const getDisplayCurrencyLabel = (): string =>
    displayCurrency === 'usd' ? 'USD' : getAssetCurrency(asset)

  // Fetch MPTokenIssuance to get the DomainID (vault credential)
  const { data: mptIssuanceData } = useQuery(
    ['getMPTIssuance', vaultShareMptId],
    async () => {
      if (!vaultShareMptId) return null
      const resp = await getLedgerEntry(rippledSocket, {
        index: vaultShareMptId,
      })
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
            <TokenTableRow label={t('data')} value={decodedData || '-'} />
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
              value={(() => {
                // Only show TVL for XRP or RLUSD vaults
                if (asset?.currency !== 'XRP' && asset?.currency !== 'RLUSD') {
                  return '--'
                }
                const convertedAmount = convertToDisplayCurrency(assetsTotal)
                if (!convertedAmount) return '--'
                return formatCompactNumber(convertedAmount, language, {
                  currency: getDisplayCurrencyLabel(),
                  prefix: displayCurrency === 'usd' ? '$' : '',
                })
              })()}
            />
            <TokenTableRow
              label={t('max_total_supply')}
              value={
                assetsMaximum
                  ? formatCompactNumber(assetsMaximum, language, {
                      currency: getAssetCurrency(asset),
                    })
                  : t('no_limit')
              }
            />
            <TokenTableRow label={t('shares')} value={renderMPTSharesLink()} />
            <TokenTableRow
              label={t('available_to_borrow')}
              value={formatCompactNumber(assetsAvailable, language, {
                currency: getAssetCurrency(asset),
              })}
            />
            <TokenTableRow
              label={t('unrealized_loss')}
              value={formatCompactNumber(lossUnrealized, language, {
                currency: getAssetCurrency(asset),
              })}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}
