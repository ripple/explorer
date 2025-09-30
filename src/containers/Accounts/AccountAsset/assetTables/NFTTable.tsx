import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useMemo, useContext, useState, useCallback } from 'react'
import { Account } from '../../../shared/components/Account'
import { PaginatedTable } from '../../../shared/components/PaginatedTable'
import { Loader } from '../../../shared/components/Loader'
import SocketContext from '../../../shared/SocketContext'
import {
  getBuyNFToffers,
  getSellNFToffers,
} from '../../../../rippled/lib/rippled'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { NFTokenLink } from '../../../shared/components/NFTokenLink'
import {
  shortenAccount,
  shortenDomain,
  shortenNFTTokenID,
} from '../../../../rippled/lib/utils'
import DomainLink from '../../../shared/components/DomainLink'
import { XRP_BASE } from '../../../shared/transactionUtils'
import { localizeNumber } from '../../../shared/utils'
import { XRP_SMALL_BALANCE_CURRENCY_OPTIONS } from '../../../shared/CurrencyOptions'
import { useLanguage } from '../../../shared/hooks'

const PAGE_SIZE = 10

interface NFTTableWithOffersProps {
  accountId: string
  onCountChange?: (count: number) => void
  fetchNFTs: (rippledSocket: any, accountId: string) => Promise<NFTBasic[]>
  queryKey: string
  showIssuer?: boolean
}

export interface NFTBasic {
  nftId: string
  issuer?: string
  url: string
  fee: string
}

export interface NFT {
  nftId: string
  issuer?: string
  url: string
  fee: string
  lowestAsk: number | null
  highestBid: number | null
}

export const NFTTable = ({
  accountId,
  onCountChange,
  fetchNFTs,
  queryKey,
  showIssuer = false,
}: NFTTableWithOffersProps) => {
  const { t } = useTranslation()
  const lang = useLanguage()
  const rippledSocket = useContext(SocketContext)
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [fetchedNFTs, setFetchedNFTs] = useState<Set<string>>(new Set())
  const [isLoadingOffers, setIsLoadingOffers] = useState(false)

  // Fetch basic NFT data first
  const nftsQuery = useQuery([queryKey, accountId], () =>
    fetchNFTs(accountId, rippledSocket),
  )

  const basicNFTs = useMemo(() => nftsQuery.data ?? [], [nftsQuery.data])

  const processXRPOffers = useCallback(
    (offers: any[], sortAscending: boolean) => {
      const xrpOffers = offers.filter(
        (offer: any) => typeof offer.amount === 'string',
      )

      if (xrpOffers.length === 0) return null

      const sortedOffers = xrpOffers.sort((a: any, b: any) => {
        const amountA = parseInt(a.amount, 10)
        const amountB = parseInt(b.amount, 10)
        return sortAscending ? amountA - amountB : amountB - amountA
      })

      const bestOffer = sortedOffers[0]
      return parseInt(bestOffer.amount, 10) / XRP_BASE
    },
    [],
  )

  const fetchOffers = useCallback(
    async (fetchFn: Function, nftId: string) => {
      try {
        const response = await fetchFn(rippledSocket, nftId, 50)
        return response.offers && response.offers.length > 0
          ? response.offers
          : []
      } catch (error) {
        console.error(error)
        return []
      }
    },
    [rippledSocket],
  )

  const fetchOffersForNFT = useCallback(
    async (nft: NFTBasic): Promise<NFT> => {
      try {
        // Get sell offers to calculate lowest ask (XRP only)
        const sellOffers = await fetchOffers(getSellNFToffers, nft.nftId)
        const lowestAsk = processXRPOffers(sellOffers, true) // ascending for lowest

        // Get buy offers to calculate highest bid (XRP only)
        const buyOffers = await fetchOffers(getBuyNFToffers, nft.nftId)
        const highestBid = processXRPOffers(buyOffers, false) // descending for highest

        return { ...nft, lowestAsk, highestBid }
      } catch (error) {
        return { ...nft, lowestAsk: null, highestBid: null }
      }
    },
    [processXRPOffers, fetchOffers],
  )

  const batchProcessNFTOffers = useCallback(
    async (nftsToFetch: NFTBasic[]) => {
      if (nftsToFetch.length === 0) return

      setIsLoadingOffers(true)

      try {
        // Fetch NFT offers sequentially to avoid being throttled
        for (const nft of nftsToFetch) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const nftWithOffers = await fetchOffersForNFT(nft)

            // Update NFT immediately as offers are fetched
            setNFTs((prev) =>
              prev.map((prevNft) =>
                prevNft.nftId === nftWithOffers.nftId ? nftWithOffers : prevNft,
              ),
            )

            // Mark as fetched
            setFetchedNFTs((prev) => new Set([...prev, nft.nftId]))
          } catch (error) {
            // Handle individual NFT errors, continue with others
            // eslint-disable-next-line no-console
            console.error(`Error fetching offers for NFT ${nft.nftId}:`, error)
          }
        }
      } catch (error) {
        console.error(error)
      }

      setIsLoadingOffers(false)
    },
    [fetchOffersForNFT],
  )

  // Initialize NFTs when basic data loads
  useEffect(() => {
    if (basicNFTs.length > 0) {
      // Initialize all NFTs with null lowest ask and highest bid
      const initialNFTs = basicNFTs.map((nft) => ({
        ...nft,
        lowestAsk: null,
        highestBid: null,
      }))
      setNFTs(initialNFTs)

      // Reset for new account
      setFetchedNFTs(new Set())
      setIsLoadingOffers(false)

      // Fetch offers for first page NFTs immediately
      const firstPageNFTs = basicNFTs.slice(0, PAGE_SIZE)

      // Fetch offers for first page NFTs immediately
      batchProcessNFTOffers(firstPageNFTs)
    }
  }, [basicNFTs, batchProcessNFTOffers])

  // Communicate total count back to parent
  useEffect(() => {
    if (onCountChange) {
      onCountChange(nfts.length)
    }
  }, [nfts.length, onCountChange])

  if (nftsQuery.isLoading) {
    return <Loader />
  }

  const tableStructure = (paginatedRows: any[]) => {
    // Fetch offers for visible NFTs when page changes
    // Only fetch if there are NFTs that haven't been fetched yet
    if (paginatedRows.length > 0) {
      const unfetchedNFTs = paginatedRows.filter(
        (nft) => !fetchedNFTs.has(nft.nftId),
      )

      if (unfetchedNFTs.length > 0 && !isLoadingOffers) {
        // Use setTimeout to avoid calling setState during render
        setTimeout(() => {
          batchProcessNFTOffers(unfetchedNFTs)
        }, 0)
      }
    }

    const colSpan = showIssuer ? 6 : 5

    return (
      <div className="account-asset-table">
        <table>
          <thead>
            <tr>
              <th>{t('account_page_asset_table_column_token_id')}</th>
              {showIssuer && (
                <th>{t('account_page_asset_table_column_issuer')}</th>
              )}
              <th>{t('account_page_asset_table_column_url')}</th>
              <th>{t('account_page_asset_table_column_transfer_fee')}</th>
              <th>{t('account_page_asset_table_column_lowest_ask')}</th>
              <th>{t('account_page_asset_table_column_highest_bid')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <EmptyMessageTableRow colSpan={colSpan}>
                {t('account_page_asset_table_no_nft')}
              </EmptyMessageTableRow>
            ) : (
              paginatedRows.map((nft, index) => (
                <tr key={nft.tokenId || `nft-${index}`}>
                  <td>
                    <NFTokenLink
                      shortTokenID={shortenNFTTokenID(nft.nftId)}
                      tokenID={nft.nftId}
                    />
                  </td>
                  {showIssuer && nft.issuer && (
                    <td>
                      <Account
                        shortAccount={shortenAccount(nft.issuer)}
                        account={nft.issuer}
                      />
                    </td>
                  )}
                  <td>
                    {nft.url ? (
                      <DomainLink
                        domain={nft.url}
                        displayDomain={shortenDomain(nft.url)}
                      />
                    ) : (
                      '--'
                    )}
                  </td>
                  <td className="transfer-fee">{nft.fee}%</td>
                  <td>
                    {nft.lowestAsk
                      ? localizeNumber(
                          nft.lowestAsk,
                          lang,
                          XRP_SMALL_BALANCE_CURRENCY_OPTIONS,
                        )
                      : '--'}
                  </td>
                  <td>
                    {nft.highestBid
                      ? localizeNumber(
                          nft.highestBid,
                          lang,
                          XRP_SMALL_BALANCE_CURRENCY_OPTIONS,
                        )
                      : '--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <PaginatedTable
      data={nfts}
      tableStructure={tableStructure}
      pageSize={PAGE_SIZE}
    />
  )
}
