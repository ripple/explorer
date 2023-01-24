import { Link } from 'react-router-dom'

export interface NFTokenLinkProps {
  tokenID: string
}

export const NFTokenLink = (props: NFTokenLinkProps) => {
  const { tokenID } = props
  return (
    <Link title={tokenID} to={`/nft/${tokenID}`}>
      {tokenID}
    </Link>
  )
}
