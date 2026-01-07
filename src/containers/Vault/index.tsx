import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import NoMatch from '../NoMatch'
import { VaultHeader } from './VaultHeader'
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
  const { trackScreenLoaded } = useAnalytics()
  const { id: vaultId = '' } = useParams<{ id: string }>()
  const [error, setError] = useState<number | null>(null)

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

  return (
    <Page vaultId={vaultId}>
      {vaultId && <VaultHeader vaultId={vaultId} setError={setError} />}
      {!vaultId && (
        <div className="vault-warning">
          <h2>Enter a Vault ID in the search box</h2>
        </div>
      )}
    </Page>
  )
}

export default Vault
