import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import NoMatch from '../NoMatch'
import NFTHeader from './NFTHeader/NFTHeader'
import './styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from '../shared/utils'

const ERROR_MESSAGES: any = {
  [NOT_FOUND]: {
    title: 'assets.no_nfts_message',
    hints: ['check_nft_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_xrpl_address',
    hints: ['check_nft_id'],
  },
  default: {
    title: 'generic_error',
    hints: ['not_your_fault'],
  },
}

const getErrorMessage = (error: any) =>
  ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default

const NFT = () => {
  const { id: tokenId } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [error, setError] = useState<number | null>(null)

  document.title = `${t('xrpl_explorer')} | ${tokenId.substr(0, 12)}...`

  useEffect(() => {
    /* @ts-ignore */
    analytics(ANALYTIC_TYPES.pageview, { title: 'NFT', path: '/token/:id' })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [])

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  return error ? (
    renderError()
  ) : (
    <div className="token-page">
      {tokenId && <NFTHeader tokenId={tokenId} setError={setError} />}
      {!tokenId && (
        <div className="nft-warning">
          <h2>Enter a NFT ID in the search box</h2>
        </div>
      )}
    </div>
  )
}

export default NFT
