import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Loader } from '../../shared/components/Loader'
import './styles.scss'
import SocketContext from '../../shared/SocketContext'
import { Tooltip, TooltipInstance } from '../../shared/components/Tooltip'
import { BAD_REQUEST, HASH192_REGEX } from '../../shared/utils'
import { Account } from '../../shared/components/Account'
import { useAnalytics } from '../../shared/analytics'
import { getMPTIssuance } from '../../../rippled/lib/rippled'
import { formatMPTIssuanceInfo } from '../../../rippled/lib/utils'
import { MPTIssuanceFormattedInfo } from '../../shared/Interfaces'
import { Details } from './Details'
import { Settings } from './Settings'

interface Props {
  tokenId: string
  setError: (error: number | null) => void
}

export const MPTHeader = (props: Props) => {
  const { t } = useTranslation()
  const { tokenId, setError } = props
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()
  const [tooltip, setTooltip] = useState<TooltipInstance | undefined>(undefined)

  const { data, isFetching: loading } = useQuery<MPTIssuanceFormattedInfo>(
    ['getMPTIssuance', tokenId],
    async () => {
      const info = await getMPTIssuance(rippledSocket, tokenId)
      return formatMPTIssuanceInfo(info)
    },
    {
      onError: (e: any) => {
        trackException(`mptIssuance ${tokenId} --- ${JSON.stringify(e)}`)
        setError(e.code)
      },
    },
  )

  useEffect(() => {
    if (!HASH192_REGEX.test(tokenId)) {
      setError(BAD_REQUEST)
    }
  }, [setError, tokenId])

  const showTooltip = (event: any, d: any) => {
    setTooltip({
      data: d,
      mode: 'mptId',
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  const hideTooltip = () => {
    setTooltip(undefined)
  }

  const renderHeaderContent = () => {
    const { issuer } = data!

    return (
      <div className="section mpt-header-container" data-testid="mpt-header">
        <div className="mpt-info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <div className="mpt-issuer">
                <Account account={issuer!} />
              </div>
            </div>
          </div>
        </div>
        <div className="mpt-bottom-container">
          <div className="details" title="details">
            <h2>{t('details')}</h2>
            <Details data={data!} />
          </div>
          <div className="settings" title="settings">
            <h2 className="title">{t('settings')}</h2>
            <Settings flags={data!.flags!} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mpt-token-header">
      <div className="section">
        {!loading && (
          <div className="mpt-box-header">
            <div className="token-title">
              MPT Issuance ID
              <div className="badge">mpt</div>
            </div>
            <div
              className="title-content"
              title="title-content"
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
      <Tooltip tooltip={tooltip} />
    </div>
  )
}
