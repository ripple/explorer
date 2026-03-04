import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import NoMatch from '../NoMatch'
import { VaultHeader } from './VaultHeader'
import { VaultTransactions } from './VaultTransactions'
import { VaultLoans } from './VaultLoans'
import { CurrencyToggle } from './CurrencyToggle'
import { Loader } from '../shared/components/Loader'
import { CopyableText } from '../shared/components/CopyableText/CopyableText'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import SocketContext from '../shared/SocketContext'
import { getVault } from '../../rippled/lib/rippled'
import { useAnalytics } from '../shared/analytics'
import { useTokenToUSDRate } from '../shared/hooks/useTokenToUSDRate'
import {
  NOT_FOUND,
  BAD_REQUEST,
  shortenVaultID,
  getCurrencySymbol,
  shortenMPTID,
} from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
import { parseVaultName, renderAssetCurrency } from './utils'
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
  error ? (ERROR_MESSAGES[error] ?? DEFAULT_ERROR) : DEFAULT_ERROR

const Page: FC<PropsWithChildren<{ vaultId: string }>> = ({
  vaultId,
  children,
}) => (
  <div className="vault-page section">
    <Helmet title={`Vault ${shortenVaultID(vaultId)}`} />
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

  // Check if USD conversion is available for this token
  // Must be called before any early returns to satisfy React hooks rules
  const { isAvailable: usdAvailable, isLoading: usdLoading } =
    useTokenToUSDRate(vaultData?.Asset)

  // Compute native currency label from vault asset
  const nativeCurrency =
    getCurrencySymbol(vaultData?.Asset?.currency) ??
    shortenMPTID(vaultData?.Asset?.mpt_issuance_id) ??
    ''

  useEffect(() => {
    trackScreenLoaded({
      vault_id: vaultId,
    })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [vaultId, trackScreenLoaded])

  // Set displayCurrency to native currency once vault data loads
  useEffect(() => {
    if (nativeCurrency && !displayCurrency) {
      setDisplayCurrency(nativeCurrency)
    }
  }, [nativeCurrency]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="vault-page section">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  if (error) {
    return <Page vaultId={vaultId}>{renderError()}</Page>
  }

  // Get the Vault's (Pseudo)Account ID for transactions
  const transactionAccountId = vaultData?.Account

  return (
    <Page vaultId={vaultId}>
      {vaultId && loading && <Loader />}
      {vaultId && !loading && vaultData && (
        <>
          <div className="vault-title-section">
            <div className="vault-title-left">
              <h1 className="vault-title">
                {parseVaultName(vaultData.Data) || t('single_asset_vault')}
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
              nativeCurrencyDisplay={renderAssetCurrency(vaultData?.Asset)}
              selected={displayCurrency}
              onToggle={(val) => setDisplayCurrency(val || nativeCurrency)}
              usdDisabled={!usdAvailable}
              usdLoading={usdLoading}
            />
          </div>
          <VaultHeader
            data={vaultData}
            vaultId={vaultId}
            displayCurrency={displayCurrency || nativeCurrency}
          />
          {transactionAccountId && (
            <VaultLoans
              vaultId={vaultId}
              vaultPseudoAccount={transactionAccountId}
              displayCurrency={displayCurrency || nativeCurrency}
              asset={vaultData.Asset}
            />
          )}
          {/* TODO: Include the VaultDepositors component here once Clio APIs are available */}
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
