import React from 'react'
import PropTypes from 'prop-types'
import { decodeHex } from '../transactionUtils'

interface Props {
  className?: string
  decode?: boolean
  domain: string
}

const DomainLink = (props: Props) => {
  const { className, decode, domain } = props

  return (
    <a
      className={className}
      rel="noopener noreferrer"
      target="_blank"
      href={`http${decode ? '' : 's'}://${decode ? decodeHex(domain) : domain}`}
    >
      {decode ? decodeHex(domain) : domain}
    </a>
  )
}

DomainLink.defaultProps = {
  className: '',
  decode: false,
}

DomainLink.propTypes = {
  className: PropTypes.string,
  decode: PropTypes.bool,
  domain: PropTypes.string.isRequired,
}

export default DomainLink
