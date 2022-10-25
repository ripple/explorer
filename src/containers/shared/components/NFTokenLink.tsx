import React from 'react'
import { Link } from 'react-router-dom'

export interface NFTokenLinkProps {
  link?: boolean
  tokenID: string
}

export const NFTokenLink = (props: NFTokenLinkProps) => {
  const { link = true, tokenID } = props
  return link ? (
    <Link title={tokenID} to={`/nft/${tokenID}`}>
      {tokenID}
    </Link>
  ) : (
    <span title={tokenID}>{tokenID}</span>
  )
}
