import classnames from 'classnames'
import { decodeHex } from '../transactionUtils'

export interface Props {
  className?: string
  decode?: boolean
  domain: string
}

const DomainLink = (props: Props) => {
  const { className, decode = false, domain } = props

  // If decode is true, decode the domain
  const decodedDomain = decode ? decodeHex(domain) : domain

  // Check if the decodedDomain contains a protocol (http:// or https://)
  const domainHasProtocol = decodedDomain.match(/^([a-z][a-z0-9+\-.]*):\/\//)

  // if the decodedDomain already has a protocol, use it; oitherwise, add 'https://'
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
