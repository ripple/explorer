import React from 'react'
import { decodeHex } from '../transactionUtils'

export interface Props {
  className?: string
  decode?: boolean
  domain: string
}

const DomainLink = (props: Props) => {
  const { className = '', decode = false, domain } = props

  return (
    <a
      className={className}
      rel="noopener noreferrer"
      target="_blank"
      href={`https://${decode ? decodeHex(domain) : domain}`}
    >
      {decode ? decodeHex(domain) : domain}
    </a>
  )
}

export default DomainLink
