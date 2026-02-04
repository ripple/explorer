import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import NoMatch from '../NoMatch'
import { VaultHeader } from './VaultHeader'
import { VaultTransactions } from './VaultTransactions'
import { VaultLoans } from './VaultLoans'
import { VaultDepositors } from './VaultDepositors'
import { CurrencyToggle } from './CurrencyToggle'
import { Loader } from '../shared/components/Loader'
import { CopyableText } from '../shared/components/CopyableText/CopyableText'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import SocketContext from '../shared/SocketContext'
import { getMPTIssuance, getVault } from '../../rippled/lib/rippled'
import { useAnalytics } from '../shared/analytics'
import { useTokenToUSDRate } from '../shared/hooks/useTokenToUSDRate'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
import { parseVaultName } from './utils'
import './styles.scss'
import { hexToString } from '../shared/components/Currency'
import { parseMPTokenMetadata } from '../shared/mptUtils'

const ERROR_MESSAGES: { [code: number]: ErrorMessage } = {
  [NOT_FOUND]: {
    title: 'vault_not_found',
    hints: ['check_vault_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_vault_id',
    hints: ['check_vault_id'],
  },
}

const DEFAULT_ERROR: ErrorMessage = {
  title: 'get_vault_failed',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error: number | null) =>
  error ? (ERROR_MESSAGES[error] ?? DEFAULT_ERROR) : DEFAULT_ERROR

const Page: FC<PropsWithChildren<{ vaultId: string }>> = ({
  vaultId,
  children,
}) => (
  <div className="vault-page">
    <Helmet title={`Vault ${vaultId.substring(0, 12)}...`} />
    {children}
  </div>
)

export const Vault = () => {
  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { id: vaultId = '' } = useParams<{ id: string }>()
  const [error, setError] = useState<number | null>(null)
  const [displayCurrency, setDisplayCurrency] = useState<string>('')
  const rippledSocket = useContext(SocketContext)
  const { tooltip } = useTooltip()

  const { data: vaultData, isFetching: loading } = useQuery(
    ['getVault', vaultId],
    async () => getVault(rippledSocket, vaultId),
    {
      enabled: !!vaultId,
      onError: (e: any) => {
        trackException(
          `Error fetching Vault data for vault ID ${vaultId} --- ${JSON.stringify(e)}`,
        )
        setError(e.code)
      },
    },
  )

  const { data: mptIssuanceData } = useQuery(
    ['getMPTIssuance', vaultData?.Asset?.mpt_issuance_id],
    async () => {
      const resp = await getMPTIssuance(
        rippledSocket,
        vaultData.Asset.mpt_issuance_id,
      )
      return resp?.node
    },
    {
      enabled: !!vaultData?.Asset?.mpt_issuance_id,
      onError: (e: any) => {
        trackException(
          `Error fetching MPT Issuance data for MPT ID ${vaultData?.Asset?.mpt_issuance_id} --- ${JSON.stringify(e)}`,
        )
        setError(e.code)
      },
    },
  )

  // Check if USD conversion is available for this token
  // Must be called before any early returns to satisfy React hooks rules
  const { isAvailable: usdAvailable, isLoading: usdLoading } =
    useTokenToUSDRate(vaultData?.Asset)

  useEffect(() => {
    trackScreenLoaded({
      vault_id: vaultId,
    })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [vaultId, trackScreenLoaded])

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="vault-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  if (error) {
    return <Page vaultId={vaultId}>{renderError()}</Page>
  }

  // Get the account ID for transactions (PseudoAccount or Owner)
  const transactionAccountId = vaultData?.PseudoAccount

  // Get display-friendly currency string from asset
  const getAssetCurrencyDisplay = (): string => {
    const asset = vaultData?.Asset
    if (!asset) return ''
    if (asset.currency) return hexToString(asset.currency)
    if (asset.mpt_issuance_id) {
      // For MPT, show ticker from metadata or truncated ID as fallback
      const metadata = parseMPTokenMetadata(mptIssuanceData?.MPTokenMetadata)
      const ticker = metadata?.ticker
      if (typeof ticker === 'string') {
        return ticker
      }
      return `MPT (${asset.mpt_issuance_id.substring(0, 6)}...)`
    }
    return ''
  }

  return (
    <Page vaultId={vaultId}>
      {vaultId && loading && <Loader />}
      {vaultId && !loading && vaultData && (
        <>
          <div className="vault-title-section">
            <div className="vault-title-left">
              <h1 className="vault-title">
                {parseVaultName(vaultData.Data) || t('yield_pool')}
              </h1>
              <div className="vault-title-id">
                <span className="vault-title-id-label">{t('vault_id')}:</span>
                <CopyableText
                  text={vaultId}
                  displayText={vaultId}
                  showCopyIcon
                />
              </div>
            </div>
            <CurrencyToggle
              nativeCurrency={getAssetCurrencyDisplay()}
              selected={displayCurrency}
              onToggle={setDisplayCurrency}
              usdDisabled={!usdAvailable}
              usdLoading={usdLoading}
            />
          </div>
          <VaultHeader
            data={vaultData}
            vaultId={vaultId}
            displayCurrency={displayCurrency}
          />
          {transactionAccountId && (
            <VaultLoans
              vaultId={vaultId}
              vaultPseudoAccount={transactionAccountId}
              assetCurrency={getAssetCurrencyDisplay()}
              displayCurrency={displayCurrency}
              asset={vaultData.Asset}
            />
          )}
          {vaultData?.ShareMPTID && (
            <VaultDepositors
              shareMptId={vaultData.ShareMPTID}
              totalSupply={vaultData.ShareTotal}
              assetsTotal={vaultData.AssetsTotal}
              asset={vaultData.Asset}
            />
          )}
          {transactionAccountId && (
            <VaultTransactions accountId={transactionAccountId} />
          )}
        </>
      )}
      <Tooltip tooltip={tooltip} />
    </Page>
  )
}

export default Vault
