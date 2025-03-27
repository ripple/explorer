import classnames from 'classnames'
import { decodeHex } from '../transactionUtils'

export interface Props {
  className?: string
  decode?: boolean
  domain: string
  keepProtocol?: boolean
}

// Matches a protocol (e.g. 'http://' or 'https://') at the start of a string.
const PROTOCOL_REGEX = /^([a-z][a-z0-9+\-.]*):\/\//
const PROTOCOL_REMOVAL_REGEX = /^(https?:\/\/)?(.*?)(\/)?$/

const DomainLink = (props: Props) => {
  const { className, decode = false, domain, keepProtocol = true } = props

  // If decode is true, decode the domain
  const decodedDomain = decode ? decodeHex(domain) : domain

  // Use the test method to check for the protocol
  const domainHasProtocol = PROTOCOL_REGEX.test(decodedDomain)

  // If decoded domain does not have a protocol, add one ; otherwise, don't
  let href = domainHasProtocol ? decodedDomain : `https://${decodedDomain}`

  if (href.startsWith('ipfs://')) {
    href = href.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }

  const domainText = keepProtocol
    ? decodedDomain
    : decodedDomain.replace(PROTOCOL_REMOVAL_REGEX, '$2')

  return (
    <a
      className={classnames('domain', className)}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
      onClick={(event) => event.stopPropagation()}
    >
      {domainText}
    </a>
  )
}

export default DomainLink
