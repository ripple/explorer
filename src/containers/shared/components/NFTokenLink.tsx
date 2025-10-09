import { RouteLink } from '../routing'
import { NFT_ROUTE } from '../../App/routes'

export interface NFTokenLinkProps {
  tokenID: string
  shortTokenID?: string
}

export const NFTokenLink = ({ tokenID, shortTokenID }: NFTokenLinkProps) => (
  <RouteLink title={tokenID} to={NFT_ROUTE} params={{ id: tokenID }}>
    {shortTokenID || tokenID}
  </RouteLink>
)
