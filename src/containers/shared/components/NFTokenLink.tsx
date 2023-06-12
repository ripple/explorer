import { RouteLink } from '../routing'
import { NFT } from '../../App/routes'

export interface NFTokenLinkProps {
  tokenID: string
}

export const NFTokenLink = ({ tokenID }: NFTokenLinkProps) => (
  <RouteLink title={tokenID} to={NFT} params={{ id: tokenID }}>
    {tokenID}
  </RouteLink>
)
