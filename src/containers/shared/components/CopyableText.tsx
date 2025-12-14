import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      {copied && <span className="copied-tooltip">{t('copied')}</span>}
    </button>
  )
}
