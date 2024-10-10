import { RouteLink } from '../routing'
import { MPT_ROUTE } from '../../App/routes'

export interface MPTokenLinkProps {
  tokenID: string
}

export const MPTokenLink = ({ tokenID }: MPTokenLinkProps) => (
  <RouteLink title={tokenID} to={MPT_ROUTE} params={{ id: tokenID }}>
    {tokenID}
  </RouteLink>
)
