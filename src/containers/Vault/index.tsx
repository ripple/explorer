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
import { Loader } from '../shared/components/Loader'
import { CopyableText } from '../shared/components/CopyableText/CopyableText'
import SocketContext from '../shared/SocketContext'
import { getVault } from '../../rippled/lib/rippled'
import { useAnalytics } from '../shared/analytics'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
import { decodeVaultData } from './utils'
import './styles.scss'

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
  error ? ERROR_MESSAGES[error] ?? DEFAULT_ERROR : DEFAULT_ERROR

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
  const rippledSocket = useContext(SocketContext)

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
  const transactionAccountId = vaultData?.PseudoAccount || vaultData?.Owner

  // Get display-friendly currency string from asset
  const getAssetCurrencyDisplay = () => {
    const asset = vaultData?.Asset
    if (!asset) return ''
    if (asset.currency === 'XRP') return 'XRP'
    if (asset.currency) return asset.currency
    if (asset.mpt_issuance_id) {
      // For MPT, show truncated ID
      return `MPT (${asset.mpt_issuance_id.substring(0, 6)}...)`
    }
    return ''
  }

  return (
    <Page vaultId={vaultId}>
      {!vaultId && (
        <div className="vault-warning">
          <h2>Enter a Vault ID in the search box</h2>
        </div>
      )}
      {vaultId && loading && <Loader />}
      {vaultId && !loading && vaultData && (
        <>
          <div className="vault-title-section">
            <h1 className="vault-title">
              {decodeVaultData(vaultData.Data) || t('yield_pool')}
            </h1>
            <div className="vault-title-id">
              <span className="vault-title-id-label">{t('vault_id')}:</span>
              <CopyableText text={vaultId} displayText={vaultId} showCopyIcon />
            </div>
          </div>
          <VaultHeader data={vaultData} vaultId={vaultId} />
          {transactionAccountId && (
            <VaultLoans
              vaultId={vaultId}
              vaultPseudoAccount={transactionAccountId}
              assetCurrency={getAssetCurrencyDisplay()}
            />
          )}
          {vaultData?.ShareMPTID && (
            <VaultDepositors
              shareMptId={vaultData.ShareMPTID}
              totalSupply={vaultData.ShareTotal}
              assetsTotal={vaultData.AssetsTotal}
            />
          )}
          {transactionAccountId && (
            <VaultTransactions accountId={transactionAccountId} />
          )}
        </>
      )}
    </Page>
  )
}

export default Vault
