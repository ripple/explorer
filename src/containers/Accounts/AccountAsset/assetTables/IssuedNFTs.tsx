import { getNFTsIssuedByAccount } from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { NFTTable, NFT } from './NFTTable'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'IssuedNFTs' })

interface IssuedNFTsProps {
  accountId: string
  onCountChange?: (count: number) => void
}

const fetchAccountIssuedNFTs = async (
  accountId: string,
  rippledSocket: any,
): Promise<NFT[]> => {
  try {
    log.info(`Fetching issued NFTs for account ${accountId}`)
    const allNFTs: any[] = []
    let marker = ''
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await getNFTsIssuedByAccount(
        rippledSocket,
        accountId,
        marker,
        25,
      )
      if (response.nfts) {
        allNFTs.push(...response.nfts)
        if (allNFTs.length % 200 === 0) {
          log.info(`${allNFTs.length} issued NFTs fetched`)
        }
      }

      marker = response.marker || ''
    } while (marker)

    log.info(`Successfully fetched ${allNFTs.length} issued NFTs`)
    return allNFTs.map((nft) => ({
      nftId: nft.nft_id,
      url: nft.uri ? Buffer.from(nft.uri, 'hex').toString('utf8') : '',
      transferFee: formatTransferFee(nft.transfer_fee),
    }))
  } catch (error) {
    log.error(`Error fetching issued NFTs: ${JSON.stringify(error)}`)
    return []
  }
}

export const IssuedNFTs = ({ onCountChange, accountId }: IssuedNFTsProps) => (
  <NFTTable
    accountId={accountId}
    onCountChange={onCountChange}
    fetchNFTs={fetchAccountIssuedNFTs}
    queryKey="issuedNFTs"
    showIssuer={false}
  />
)
