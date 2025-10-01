import { getAccountNFTs } from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { NFTTable, NFT } from './NFTTable'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'HeldNFTs' })

interface HeldNFTsProps {
  accountId: string
  onCountChange?: (count: number) => void
}

const fetchAccountHeldNFTs = async (
  accountId: string,
  rippledSocket: any,
): Promise<NFT[]> => {
  try {
    log.info(`Fetching held NFTs for account ${accountId}`)
    const allNFTs: any[] = []
    let marker = ''
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await getAccountNFTs(
        rippledSocket,
        accountId,
        marker,
        10, // Not 10 NFTs, but 10 pages of NFTs
      )
      if (response.account_nfts) {
        allNFTs.push(...response.account_nfts)
        log.info(`${allNFTs.length} held NFTs fetched`)
      }

      marker = response.marker || ''
    } while (marker)

    log.info(`Successfully fetched ${allNFTs.length} held NFTs`)
    return allNFTs.map((nft) => ({
      nftId: nft.NFTokenID,
      issuer: nft.Issuer,
      url: nft.URI ? Buffer.from(nft.URI, 'hex').toString('utf8') : '',
      transferFee: formatTransferFee(nft.TransferFee),
    }))
  } catch (error) {
    log.error(`Error fetching held NFTs: ${JSON.stringify(error)}`)
    return []
  }
}

export const HeldNFTs = ({ accountId, onCountChange }: HeldNFTsProps) => (
  <NFTTable
    accountId={accountId}
    onCountChange={onCountChange}
    fetchNFTs={fetchAccountHeldNFTs}
    queryKey="heldNFTs"
    showIssuer
  />
)
