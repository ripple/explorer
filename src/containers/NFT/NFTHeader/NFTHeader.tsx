import React, { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import Loader from '../../shared/components/Loader'
import '../../shared/css/nested-menu.scss'
import './styles.scss'
import SocketContext from '../../shared/SocketContext'
import Tooltip from '../../shared/components/Tooltip'
import { getNFTInfo, getAccountInfo } from '../../../rippled/lib/rippled'
import { formatNFTInfo, formatAccountInfo } from '../../../rippled/lib/utils'
import {
  localizeDate,
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  HASH_REGEX,
} from '../../shared/utils'
import { Details } from './Details'
import { Settings } from './Settings'
import Account from '../../shared/components/Account'
import { getOldestNFTTransaction } from '../../../rippled/NFTTransactions'
import { useLanguage } from '../../shared/hooks'
import { NFTFormattedInfo, AccountFormattedInfo } from '../../shared/Interfaces'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

interface Props {
  tokenId: string
  setError: (error: number | null) => void
}

export const NFTHeader = (props: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { tokenId, setError } = props
  const rippledSocket = useContext(SocketContext)
  const [tooltip, setTooltip] = useState(null)
  const { data, isFetching: loading } = useQuery<NFTFormattedInfo>(
    ['getNFTInfo'],
    async () => {
      const info = await getNFTInfo(rippledSocket, tokenId)
      return formatNFTInfo(info)
    },
    {
      onError: (e: any) => {
        /* @ts-ignore */
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

  // fetch the oldest NFT transaction to get its minted data
  const { data: firstTransaction } = useQuery(
    ['getFirstTransaction', tokenId],
    () => getOldestNFTTransaction(rippledSocket, tokenId),
    {
      enabled: !!data,
    },
  )

  // fetch account from issuer to get the domain
  const { data: accountData } = useQuery<AccountFormattedInfo>(
    ['getAccountInfo'],
    async () => {
      const info = await getAccountInfo(rippledSocket, data?.issuer)
      return formatAccountInfo(info, {})
    },
    { enabled: !!data },
  )

  const mintedDate =
    firstTransaction && firstTransaction.transaction?.type === 'NFTokenMint'
      ? `${localizeDate(
          new Date(firstTransaction.transaction.date),
          language,
          DATE_OPTIONS,
        )} ${TIME_ZONE}`
      : undefined

  const showTooltip = (event: any, d: any) => {
    setTooltip({ ...d, mode: 'nftId', x: event.pageX, y: event.pageY })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const renderHeaderContent = () => {
    const { issuer } = data!
    return (
      <div className="section nft-header-container">
        <div className="nft-info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <div className="nft-issuer">
                <Account account={issuer!} />
              </div>
            </div>
          </div>
        </div>
        <div className="nft-bottom-container">
          <div className="details">
            <div className="title">{t('details')}</div>
            <Details
              data={{
                ...data,
                domain: accountData?.domain,
                minted: mintedDate,
              }}
            />
          </div>
          <div className="settings">
            <div className="title">{t('settings')}</div>
            <Settings flags={data?.flags ?? []} />
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
