import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useParams } from 'react-router'
import { XrplClient } from 'xrpl-client'

import { concatNFT } from '../../shared/utils'
import { loadAccountNFTs } from './actions'
import Loader from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { AccountNFToken } from '../../shared/transactionUtils'
import { AccountNFTState } from './reducer'

interface Props {
  loading: boolean
  data: AccountNFTState['data']
  actions: {
    loadAccountNFTs: (
      accountId: string,
      marker: string | undefined,
      socket: XrplClient | undefined,
    ) => {}
  }
}

const AccountNFTTableDisconnected = (props: Props) => {
  const [nfts, setNfts] = useState<AccountNFToken[]>([])
  const [marker, setMarker] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const { id: accountId } = useParams<{ id: string }>()
  const { actions, data, loading } = props
  const rippledSocket = useContext(SocketContext)

  useEffect(() => {
    if (data.nfts === undefined) return
    setMarker(data.marker)
    setNfts((oldNfts: AccountNFToken[]): AccountNFToken[] =>
      concatNFT(oldNfts, data.nfts || []),
    )
  }, [accountId, data])

  useEffect(() => {
    setNfts([])
    setMarker(undefined)
    actions.loadAccountNFTs(accountId, undefined, rippledSocket)
  }, [accountId])

  const loadMoreNfts = () => {
    actions.loadAccountNFTs(accountId, marker, rippledSocket)
  }

  function renderNoResults() {
    return (
      <tr>
        <td colSpan={3} className="empty-message">
          {t('assets.no_tokens_message')}
        </td>
      </tr>
    )
  }

  const renderRow = (nft: any) => (
    <tr key={nft.NFTokenID}>
      <td>{nft.NFTokenID}</td>
      <td>{nft.Issuer}</td>
      <td>{nft.NFTokenTaxon}</td>
    </tr>
  )

  const renderLoadMoreButton = () =>
    marker && (
      <button type="button" className="load-more-btn" onClick={loadMoreNfts}>
        {t('load_more_action')}
      </button>
    )

  return (
    <div className="section nfts-table">
      <table className="basic">
        <thead>
          <tr className="transaction-li transaction-li-header">
            <th className="col-token-id">{t('token_id')}</th>
            <th className="col-issuer">{t('issuer')}</th>
            <th className="col-taxon">{t('taxon')}</th>
          </tr>
        </thead>
        <tbody>
          {!loading && (nfts?.length ? nfts.map(renderRow) : renderNoResults())}
        </tbody>
      </table>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  )
}

export const AccountNFTTable = connect(
  (state: { accountNFTs: AccountNFTState }) => ({
    loading: state.accountNFTs.loading,
    data: state.accountNFTs.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadAccountNFTs,
      },
      dispatch,
    ),
  }),
)(AccountNFTTableDisconnected)
