import { useState } from 'react'

interface CopyableTextProps {
  text: string
  displayText: string
  className?: string
}

export const CopyableText = ({
  text,
  displayText,
  className,
}: CopyableTextProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      className={`copy-button ${className || ''}`}
      onClick={handleCopy}
      title="Click to copy"
    >
      {displayText}
      {copied && <span className="copied-tooltip">Copied</span>}
    </button>
  )
}
