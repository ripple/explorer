import React, { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'
import Loader from '../../shared/components/Loader'
import '../../shared/css/nested-menu.css'
import './styles.css'
import SocketContext from '../../shared/SocketContext'
import Tooltip from '../../shared/components/Tooltip'
import CopyToClipboard from '../../shared/components/CopyToClipboard'
import { getNFTInfo } from '../../../rippled/lib/rippled'
import { formatNFTInfo } from '../../../rippled/lib/utils'
import {
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  HASH_REGEX,
} from '../../shared/utils'

const NFTHeader = (props) => {
  const { t } = useTranslation()
  const { tokenId, setError } = props
  const rippledSocket = useContext(SocketContext)
  const [tooltip, setTooltip] = useState(null)
  const {
    data: rawData,
    isFetching: loading,
    error,
    isError,
  } = useQuery(['getNFTInfo'], async () => getNFTInfo(rippledSocket, tokenId))

  useEffect(() => {
    if (!HASH_REGEX.test(tokenId)) {
      setError(BAD_REQUEST)
    }
    if (isError && error) {
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `NFT ${tokenId} --- ${JSON.stringify(error)}`,
      })
      setError(error.code)
    }
  }, [isError, error, tokenId])

  const data = rawData && formatNFTInfo(rawData)

  const showTooltip = (event, d) => {
    setTooltip({ ...d, mode: 'nftId', x: event.pageX, y: event.pageY })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const renderDetails = () => {
    const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data
    const abbrvEmail =
      emailHash?.length > 20 ? emailHash?.slice(0, 20).concat('...') : emailHash
    const abbrvURI = uri?.length > 20 ? uri?.slice(0, 20).concat('...') : uri
    return (
      <table className="token-table">
        <tbody>
          {minted && (
            <tr className="row">
              <td className="col1">Minted</td>
              <td className="col2">{minted}</td>
            </tr>
          )}
          {domain && (
            <tr className="row">
              <td className="col1">{t('domain')}</td>
              <td className="col2">
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {domain}
                </a>
              </td>
            </tr>
          )}
          {emailHash && (
            <tr className="row">
              <td className="col1">{t('email_hash')}</td>
              <td className="col2">
                {abbrvEmail}
                <CopyToClipboard className="copy" text={emailHash} />
              </td>
            </tr>
          )}
          <tr className="row">
            <td className="col1">Taxon ID</td>
            <td className="col2">{NFTTaxon}</td>
          </tr>
          {uri && (
            <tr className="row">
              <td className="col1">URI</td>
              <td className="col2">
                <a href={uri} target="_blank" rel="noopener noreferrer">
                  {abbrvURI}
                </a>
              </td>
            </tr>
          )}
          <tr className="row">
            <td className="col1">Transfer Fee</td>
            <td className="col2">{transferFee}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  const renderSettings = () => {
    const { flags } = data

    const burnable = flags.includes('lsfBurnable') ? 'enabled' : 'disabled'
    const onlyXRP = flags.includes('lsfOnlyXRP') ? 'enabled' : 'disabled'
    const trustLine = flags.includes('lsfTrustLine') ? 'enabled' : 'disabled'
    const transferable = flags.includes('lsfTransferable')
      ? 'enabled'
      : 'disabled'
    return (
      <table className="token-table">
        <tbody>
          <tr className="row">
            <td className="col1">Burnable</td>
            <td className="col2">{burnable}</td>
          </tr>
          <tr className="row">
            <td className="col1">Only XRP</td>
            <td className="col2">{onlyXRP}</td>
          </tr>
          <tr className="row">
            <td className="col1">Trust Line</td>
            <td className="col2">{trustLine}</td>
          </tr>
          <tr className="row">
            <td className="col1">Transferable</td>
            <td className="col2">{transferable}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  const renderHeaderContent = () => {
    const { issuer } = data
    const abbrvIssuer = issuer.slice(0, 23).concat('...')
    return (
      <div className="section nft-header-container">
        <div className="nft-info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Link className="nft-issuer" to={`/accounts/${issuer}`}>
                {abbrvIssuer}
              </Link>
              <CopyToClipboard className="copy" text={issuer} />
            </div>
          </div>
        </div>
        <div className="nft-bottom-container">
          <div className="details">
            <div className="title">{t('details')}</div>
            {renderDetails()}
          </div>
          <div className="settings">
            <div className="title">{t('settings')}</div>
            {renderSettings()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nft-token-header">
      <div className="section">
        {!loading && (
          <div className="nft-box-header">
            <div className="token-title">
              NFT ID
              <div className="token-type">
                <div className="subscript">NFT</div>
              </div>
            </div>
            <div
              className="title-content"
              onMouseOver={(e) => showTooltip(e, { tokenId })}
              onFocus={() => {}}
              onMouseLeave={hideTooltip}
            >
              {tokenId}
            </div>
          </div>
        )}
      </div>
      <div className="box-content">
        {loading ? <Loader /> : renderHeaderContent()}
      </div>
      <Tooltip data={tooltip} />
    </div>
  )
}

NFTHeader.propTypes = {
  tokenId: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
}

export default NFTHeader
