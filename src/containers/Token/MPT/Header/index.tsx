import { useEffect, useState, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Loader } from '../../../shared/components/Loader'
import './styles.scss'
import {
  BAD_REQUEST,
  HASH192_REGEX,
  shortenDomain,
  shortenMPTID,
} from '../../../shared/utils'
import { CopyableText } from '../../../shared/components/CopyableText'
import DomainLink from '../../../shared/components/DomainLink'
import { FormattedMPTIssuance } from '../../../shared/Interfaces'
import { GeneralOverview } from './GeneralOverview'
import { MarketData } from './MarketData'
import { Settings } from './Settings'

import { Metadata } from './Metadata'
import GlobeSvg from '../../../shared/images/globe.svg'
import DefaultTokenIcon from '../../../shared/images/default_token_icon.svg'
import DownArrow from '../../../shared/images/down_arrow.svg'
import InfoIcon from '../../../shared/images/info-duotone.svg'

interface MetadataUri {
  uri: string
  category: string
  title: string
}

interface Props {
  mptIssuanceId: string
  data?: FormattedMPTIssuance
  loading?: boolean
  setError: (error: number | null) => void
  holdersCount?: number
  holdersLoading?: boolean
}

export const Header = (props: Props) => {
  const { t } = useTranslation()
  const {
    mptIssuanceId,
    data,
    loading,
    setError,
    holdersCount,
    holdersLoading,
  } = props
  const [showURLDropdown, setShowURLDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!HASH192_REGEX.test(mptIssuanceId)) {
      setError(BAD_REQUEST)
    }
  }, [setError, mptIssuanceId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowURLDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="box token-header mpt">
        <Loader />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const {
    issuer,
    assetScale,
    maxAmt,
    outstandingAmt,
    transferFee,
    flags,
    rawMPTMetadata,
    parsedMPTMetadata,
    isMPTMetadataCompliant,
  } = data
  const ticker = parsedMPTMetadata?.ticker as string | undefined
  const logoUrl = parsedMPTMetadata?.icon as string | undefined
  const issuerName = parsedMPTMetadata?.issuer_name as string | undefined
  const uris = parsedMPTMetadata?.uris as MetadataUri[] | undefined

  const showMPTMetadataWarning = !isMPTMetadataCompliant
  // Only show MPT issuance ID if ticker exists (since we show ticker in header, need to show ID somewhere)
  const showMPTIssuanceId = !!ticker

  // Get all URIs for dropdown, filtering out items without uri
  const allUris = (uris || []).filter((u) => u.uri)

  return (
    <div className="box token-header mpt">
      {showMPTMetadataWarning && (
        <div className="section metadata-warning">
          <InfoIcon className="warning-icon" aria-hidden="true" />
          <div className="warning-message">
            <Trans
              i18nKey="mpt_page.metadata_warning"
              components={{
                br: <br />,
                a: (
                  <a
                    href="https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens#metadata-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* placeholder */}
                  </a>
                ),
              }}
            />
          </div>
        </div>
      )}
      <div className="section token-indicator">
        <div className="token-label">{t('mpt_page.token_label')}</div>
        <div className="category-pill">
          <div className="category-text">{t('mpt_page.category_text')}</div>
        </div>
      </div>
      <div className="section box-header">
        <div className="token-info-group">
          {logoUrl ? (
            <img
              className="token-logo"
              alt={`${ticker || mptIssuanceId} logo`}
              src={logoUrl}
            />
          ) : (
            <DefaultTokenIcon className="token-logo no-logo" />
          )}
          {ticker ? (
            <span>{ticker.toUpperCase()}</span>
          ) : (
            <span className="mpt-id-copyable">
              <CopyableText
                text={mptIssuanceId.toUpperCase()}
                displayText={shortenMPTID(mptIssuanceId)}
              />
            </span>
          )}
          {/* Show issuer name if available */}
          {issuerName && (
            <div className="token-issuer-wrap">
              <span className="paren">(</span>
              <span className="issuer-name">{issuerName}</span>
              <span className="paren">)</span>
            </div>
          )}
        </div>

        {allUris.length > 0 && (
          <div className="header-actions">
            <div
              className="domain-link-container links-dropdown-container"
              ref={dropdownRef}
            >
              <GlobeSvg className="domain-link-icon" />
              <DomainLink
                className="domain-link"
                domain={allUris[0].uri}
                displayDomain={shortenDomain(allUris[0].uri, 12, 7)}
                keepProtocol={false}
              />
              {allUris.length > 1 && (
                <button
                  type="button"
                  className="dropdown-toggle-button"
                  onClick={() => setShowURLDropdown(!showURLDropdown)}
                >
                  <DownArrow className="dropdown-arrow" />
                </button>
              )}
              {showURLDropdown && allUris.length > 1 && (
                <div className="links-dropdown-menu">
                  {allUris.slice(1).map((uriItem) => (
                    <DomainLink
                      key={`${uriItem.uri}-${uriItem.category}-${uriItem.title}`}
                      className="links-dropdown-item"
                      domain={uriItem.uri}
                      displayDomain={shortenDomain(uriItem.uri, 12, 7)}
                      keepProtocol={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="section box-content">
        <div className="header-boxes">
          <GeneralOverview
            issuer={issuer}
            issuerName={issuerName}
            transferFee={transferFee}
            assetScale={assetScale}
            mptIssuanceId={mptIssuanceId}
            showMptId={showMPTIssuanceId}
            holdersCount={holdersCount}
            holdersLoading={holdersLoading}
          />
          <MarketData
            maxAmt={maxAmt}
            outstandingAmt={outstandingAmt}
            assetScale={assetScale}
          />
          <Settings flags={flags} />
          {(parsedMPTMetadata || rawMPTMetadata) && (
            <Metadata
              decodedMPTMetadata={(parsedMPTMetadata || rawMPTMetadata)!}
            />
          )}
        </div>
      </div>
    </div>
  )
}
