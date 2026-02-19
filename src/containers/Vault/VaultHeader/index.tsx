import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { Account } from '../../shared/components/Account'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useTokenToUSDRate } from '../../shared/hooks/useTokenToUSDRate'
import { RouteLink } from '../../shared/routing'
import { MPT_ROUTE } from '../../App/routes'
import SocketContext from '../../shared/SocketContext'
import { getMPTIssuance } from '../../../rippled/lib/rippled'
import { parseVaultWebsite } from '../utils'
import {
  shortenMPTID,
  shortenVaultID,
  shortenAccount,
  getCurrencySymbol,
} from '../../shared/utils'
import './styles.scss'
import { useAnalytics } from '../../shared/analytics'
import { parseAmount } from '../../shared/NumberFormattingUtils'
import { convertHexToString } from '../../../rippled/lib/utils'
import { Metadata } from '../../Token/MPT/Header/Metadata'

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
  displayCurrency: string
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
  if (asset.currency === 'XRP') return getCurrencySymbol('XRP')
  if (asset.mpt_issuance_id) {
    return (
      <RouteLink to={MPT_ROUTE} params={{ id: asset.mpt_issuance_id }}>
        {shortenMPTID(asset.mpt_issuance_id, 8, 6)}
      </RouteLink>
    )
  }
  return asset.currency
}

const getAssetCurrency = (asset: VaultData['Asset']): string =>
  asset?.currency === 'XRP' ? '\uE900' : asset?.currency || ''

export const VaultHeader = ({ data, vaultId, displayCurrency }: Props) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const { rate: tokenToUsdRate } = useTokenToUSDRate(data.Asset)

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

  // Converts amount to USD if displayCurrency is 'USD', otherwise returns as-is
  const convertToDisplayCurrency = (
    amount: string | undefined,
  ): string | undefined => {
    if (!amount || displayCurrency !== 'USD') return amount

    const numAmount = Number(amount)
    if (Number.isNaN(numAmount)) return amount

    return tokenToUsdRate > 0 ? String(numAmount * tokenToUsdRate) : undefined
  }

  // Returns 'USD' when showing USD values, otherwise the vault's asset currency
  const getDisplayCurrencyLabel = (): string =>
    displayCurrency === 'USD' ? 'USD' : getAssetCurrency(asset)

  // Fetch MPTokenIssuance to get the DomainID (vault credential)
  const { data: mptIssuanceData } = useQuery(
    ['getVaultShareMPTIssuance', vaultShareMptId],
    async () => {
      if (!vaultShareMptId) return null
      const resp = await getMPTIssuance(rippledSocket, vaultShareMptId)
      return resp?.node
    },
    {
      enabled: !!vaultShareMptId,
      onError: (e: any) => {
        trackException(
          `Error fetching MPT Issuance data for MPT ID ${vaultShareMptId} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  const vaultCredential = mptIssuanceData?.DomainID

  const isPrivate =
    flags !== undefined && (flags & VAULT_FLAGS.lsfPrivate) !== 0

  const decodedData = convertHexToString(vaultDataRaw)
  const vaultWebsite = parseVaultWebsite(vaultDataRaw)

  const getWithdrawalPolicyText = () => {
    if (withdrawalPolicy === undefined) return '-'
    const policyKey = WITHDRAWAL_POLICIES[withdrawalPolicy]
    if (!policyKey) return String(withdrawalPolicy)
    // Use type assertion for dynamic translation keys
    return t(policyKey as 'first_come_first_served')
  }

  const renderMPTSharesLink = () => {
    if (!vaultShareMptId) return '-'
    return (
      <RouteLink
        className="currency"
        data-testid="currency"
        to={MPT_ROUTE}
        params={{ id: vaultShareMptId }}
      >
        {vaultShareMptId}
      </RouteLink>
    )
  }

  return (
    <div className="vault-section">
      <h2 className="vault-section-title">{t('vault')}</h2>
      <div className="vault-section-divider" />
      <div className="vault-details-container">
        <div className="details-column">
          <table className="token-table">
            <tbody>
              <TokenTableRow
                label={t('vault_id')}
                value={
                  <CopyableText
                    text={vaultId}
                    displayText={`${shortenVaultID(vaultId)}`}
                    showCopyIcon
                  />
                }
              />
              {owner && (
                <TokenTableRow
                  label={t('owner')}
                  value={
                    <Account
                      account={owner}
                      displayText={`${shortenAccount(owner)}`}
                    />
                  }
                />
              )}
              <TokenTableRow
                label={t('private_vault')}
                value={
                  <div className="private-vault-toggle">
                    <span
                      className={`toggle-pill ${isPrivate ? 'active' : ''}`}
                    >
                      {t('yes')}
                    </span>
                    <span
                      className={`toggle-pill ${!isPrivate ? 'active' : ''}`}
                    >
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
              {vaultWebsite && (
                <TokenTableRow
                  label={t('website')}
                  value={
                    <a
                      href={
                        vaultWebsite.startsWith('http')
                          ? vaultWebsite
                          : `https://${vaultWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vaultWebsite}
                    </a>
                  }
                />
              )}
              <TokenTableRow
                label={t('data')}
                value={
                  <Metadata
                    decodedMPTMetadata={(() => {
                      if (!decodedData) return '-'
                      try {
                        return JSON.parse(decodedData)
                      } catch {
                        return decodedData
                      }
                    })()}
                    displayMetadataTitle={false}
                  />
                }
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
                value={(() => {
                  const convertedAmount = convertToDisplayCurrency(assetsTotal)
                  if (
                    convertedAmount === undefined &&
                    displayCurrency === 'usd'
                  ) {
                    return '--'
                  }
                  const amount = convertedAmount ?? assetsTotal
                  if (amount === undefined) return '--'
                  return `${parseAmount(amount, 2)} ${getDisplayCurrencyLabel()}`
                })()}
              />
              <TokenTableRow
                label={t('max_total_supply')}
                value={
                  assetsMaximum
                    ? `${parseAmount(assetsMaximum, 2)} ${getAssetCurrency(asset)}`
                    : t('no_limit')
                }
              />
              <TokenTableRow
                label={t('shares')}
                value={renderMPTSharesLink()}
              />
              <TokenTableRow
                label={t('available_to_borrow')}
                value={`${parseAmount(assetsAvailable ?? '0', 2)} ${getAssetCurrency(asset)}`}
              />
              <TokenTableRow
                label={t('unrealized_loss')}
                value={`${parseAmount(lossUnrealized ?? 0, 2)} ${getAssetCurrency(asset)}`}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
