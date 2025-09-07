import { getNFTsIssuedByAccount } from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { NFTTable, NFTBasic } from './NFTTable'

interface IssuedNFTsProps {
  accountId: string
  onCountChange?: (count: number) => void
}

const fetchAccountIssuedNFTs = async (
  accountId: string,
  rippledSocket: any,
): Promise<NFTBasic[]> => {
  try {
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
        console.log('Fetched account NFTs: ', response.nfts.length)
        allNFTs.push(...response.nfts)
      }
      marker = response.marker || ''
    } while (marker)

    return allNFTs.map((nft) => ({
      nftId: nft.nft_id,
      url: nft.uri ? Buffer.from(nft.uri, 'hex').toString('utf8') : '',
      fee: formatTransferFee(nft.transfer_fee),
    }))
  } catch (error) {
    console.error(error)
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
