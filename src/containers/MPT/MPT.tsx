import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import NoMatch from '../NoMatch'
import { MPTHeader } from './MPTHeader/MPTHeader'
import { useAnalytics } from '../shared/analytics'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
import './styles.scss'

const ERROR_MESSAGES: { [code: number]: ErrorMessage } = {
  [NOT_FOUND]: {
    title: 'assets.no_mpts_message',
    hints: ['check_mpt_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_xrpl_address',
    hints: ['check_mpt_id'],
  },
}

const DEFAULT_ERROR: ErrorMessage = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error: any) => ERROR_MESSAGES[error] ?? DEFAULT_ERROR

const Page: FC<PropsWithChildren<{ tokenId: string }>> = ({
  tokenId,
  children,
}) => (
  <div className="mpt-page">
    <Helmet title={`MPT ${tokenId.substr(0, 12)}...`} />
    {children}
  </div>
)

export const MPT = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { id: tokenId = '' } = useParams<{ id: string }>()
  const [error, setError] = useState<number | null>(null)

  useEffect(() => {
    trackScreenLoaded({
      mpt_issuance_id: tokenId,
    })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [tokenId, trackScreenLoaded])

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  if (error) {
    return <Page tokenId={tokenId}>{renderError()}</Page>
  }
  return (
    <Page tokenId={tokenId}>
      {tokenId && <MPTHeader tokenId={tokenId} setError={setError} />}
      {!tokenId && (
        <div className="mpt-warning">
          <h2>Enter a MPT Issuance ID in the search box</h2>
        </div>
      )}
    </Page>
  )
}
