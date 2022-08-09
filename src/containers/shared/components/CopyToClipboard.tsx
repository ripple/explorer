import React from 'react'
import copy from '../images/copy.png'

interface Props {
  text: string
  className?: string
}

export const CopyToClipboard = ({ text, className }: Props) => (
  <input
    className={className}
    type="image"
    src={copy}
    alt="Copy"
    onClick={() => navigator.clipboard.writeText(text)}
  />
)

CopyToClipboard.defaultProps = {
  className: null,
}
