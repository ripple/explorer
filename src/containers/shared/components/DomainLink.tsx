import classnames from 'classnames'
import { decodeHex } from '../transactionUtils'

export interface Props {
  className?: string
  decode?: boolean
  domain: string
}

// Matches a protocol (e.g. 'http://' or 'https://') at the start of a string.
const protocolRegex = /^([a-z][a-z0-9+\-.]*):\/\//

const DomainLink = (props: Props) => {
  const { className, decode = false, domain } = props

  // If decode is true, decode the domain
  const decodedDomain = decode ? decodeHex(domain) : domain

  // Use the test method to check for the protocol
  const domainHasProtocol = protocolRegex.test(decodedDomain)

  // If decoded domain does not have a protocol, add one ; otherwise, don't
  const href = domainHasProtocol ? decodedDomain : `https://${decodedDomain}`

  return (
    <a
      className={classnames('domain', className)}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      {decode ? decodeHex(domain) : domain}
    </a>
  )
}

export default DomainLink
