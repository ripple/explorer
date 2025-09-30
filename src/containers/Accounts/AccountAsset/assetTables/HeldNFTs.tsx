import { getAccountNFTs } from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { NFTTable, NFTBasic } from './NFTTable'

interface HeldNFTsProps {
  accountId: string
  onCountChange?: (count: number) => void
}

const fetchAccountHeldNFTs = async (
  accountId: string,
  rippledSocket: any,
): Promise<NFTBasic[]> => {
  try {
    const allNFTs: any[] = []
    let marker = ''
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await getAccountNFTs(
        rippledSocket,
        accountId,
        marker,
        10,
      )
      if (response.account_nfts) {
        allNFTs.push(...response.account_nfts)
      }
      marker = response.marker || ''
    } while (marker)

    return allNFTs.map((nft) => ({
      nftId: nft.NFTokenID,
      issuer: nft.Issuer,
      url: nft.URI ? Buffer.from(nft.URI, 'hex').toString('utf8') : '',
      fee: formatTransferFee(nft.TransferFee),
    }))
  } catch (error) {
    console.error(error)
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
