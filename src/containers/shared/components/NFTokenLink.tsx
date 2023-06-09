import { Link } from '../routing'
import { NFT } from '../../App/routes'

export interface NFTokenLinkProps {
  tokenID: string
}

export const NFTokenLink = ({ tokenID }: NFTokenLinkProps) => (
  <Link title={tokenID} to={NFT} params={{ id: tokenID }}>
    {tokenID}
  </Link>
)
