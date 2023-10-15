import classnames from 'classnames'
import { decodeHex } from '../transactionUtils'

export interface Props {
  className?: string
  decode?: boolean
  domain: string
}

const DomainLink = (props: Props) => {
  const { className, decode = false, domain } = props

  // Ensure that "https://" is not added twice
  const domainWithoutProtocol = domain.replace(/^https?:\/\//, '')

  // If decode is true, decode the domain
  const decodedDomain = decode
    ? decodeHex(domainWithoutProtocol)
    : domainWithoutProtocol

  // Construct the href based on the decoded or original domain
  const href =
    decodedDomain.startsWith('http://') || decodedDomain.startsWith('https://')
      ? decodedDomain
      : `https://${decodedDomain}`

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
