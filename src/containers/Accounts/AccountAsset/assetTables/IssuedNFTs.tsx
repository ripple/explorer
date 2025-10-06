import { getNFTsIssuedByAccount } from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { NFTTable, NFT } from './NFTTable'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'IssuedNFTs' })

interface IssuedNFTsProps {
  accountId: string
  onChange?: (data: { count: number; isLoading: boolean }) => void
}

const fetchAccountIssuedNFTs = async (
  accountId: string,
  rippledSocket: any,
): Promise<NFT[]> => {
  try {
    const allNFTs: any[] = []
    let marker = ''
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await getNFTsIssuedByAccount(
        rippledSocket,
        accountId,
        marker,
        50,
      )
      if (response.nfts) {
        allNFTs.push(...response.nfts)
      }

      marker = response.marker || ''
    } while (marker)

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

export const IssuedNFTs = ({ accountId, onChange }: IssuedNFTsProps) => (
  <NFTTable
    accountId={accountId}
    onChange={onChange}
    fetchNFTs={fetchAccountIssuedNFTs}
    queryKey="issuedNFTs"
    showIssuer={false}
  />
)
