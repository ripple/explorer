import { RouteLink } from '../routing'
import { NFT_ROUTE } from '../../App/routes'

export interface NFTokenLinkProps {
  tokenID: string
}

export const NFTokenLink = ({ tokenID }: NFTokenLinkProps) => (
  <RouteLink title={tokenID} to={NFT_ROUTE} params={{ id: tokenID }}>
    {tokenID}
  </RouteLink>
)
