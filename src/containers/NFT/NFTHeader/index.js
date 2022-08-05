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
import { getNFTInfo } from '../../../rippled/lib/rippled'
import { formatNFTInfo } from '../../../rippled/lib/utils'
import {
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  HASH_REGEX,
} from '../../shared/utils'
import Details from './Details'
import Settings from './Settings'

const NFTHeader = (props) => {
  const { t } = useTranslation()
  const { tokenId, setError } = props
  const rippledSocket = useContext(SocketContext)
  const [tooltip, setTooltip] = useState(null)
  const { data: rawData, isFetching: loading } = useQuery(
    ['getNFTInfo'],
    async () => getNFTInfo(rippledSocket, tokenId),
    {
      onError: (e) => {
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `NFT ${tokenId} --- ${JSON.stringify(e)}`,
        })
        setError(e.code)
      },
    },
  )

  useEffect(() => {
    if (!HASH_REGEX.test(tokenId)) {
      setError(BAD_REQUEST)
    }
  }, [tokenId])

  const data = rawData && formatNFTInfo(rawData)

  const showTooltip = (event, d) => {
    setTooltip({ ...d, mode: 'nftId', x: event.pageX, y: event.pageY })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const renderHeaderContent = () => {
    const { issuer } = data
    return (
      <div className="section nft-header-container">
        <div className="nft-info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Link className="nft-issuer" to={`/accounts/${issuer}`}>
                {issuer}
              </Link>
            </div>
          </div>
        </div>
        <div className="nft-bottom-container">
          <div className="details">
            <div className="title">{t('details')}</div>
            <Details data={data} />
          </div>
          <div className="settings">
            <div className="title">{t('settings')}</div>
            <Settings flags={data.flags} />
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
