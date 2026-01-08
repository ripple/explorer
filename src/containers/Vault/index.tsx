import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import NoMatch from '../NoMatch'
import { VaultHeader } from './VaultHeader'
import { VaultTransactions } from './VaultTransactions'
import { VaultLoans } from './VaultLoans'
import { Loader } from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { getVault } from '../../rippled/lib/rippled'
import { useAnalytics } from '../shared/analytics'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
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
  title: 'generic_error',
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
        trackException(`Vault ${vaultId} --- ${JSON.stringify(e)}`)
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
  console.log('incoming vault data', vaultData)

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
          <VaultHeader data={vaultData} vaultId={vaultId} />
          {transactionAccountId && (
            <VaultLoans
              vaultId={vaultId}
              vaultPseudoAccount={transactionAccountId}
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
