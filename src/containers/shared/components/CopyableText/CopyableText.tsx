import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'

interface CopyableTextProps {
  /** The text to copy to clipboard when clicked */
  text: string
  /** The text displayed in the button */
  displayText: string
}

/**
 * A button component that copies text to the clipboard when clicked.
 *
 * - Shows "Click to copy" tooltip on hover/focus
 * - Shows green "Copied" tooltip for 2 seconds after clicking
 */
export const CopyableText = ({ text, displayText }: CopyableTextProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setShowHint(false)
    // Remove focus after clicking, so the green highlight goes away when "Copied" is shown.
    e.currentTarget.blur()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMouseEnter = () => {
    if (!copied) {
      setShowHint(true)
    }
  }

  const handleMouseLeave = () => {
    setShowHint(false)
  }

  const handleFocus = () => {
    if (!copied) {
      setShowHint(true)
    }
  }

  const handleBlur = () => {
    setShowHint(false)
  }

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {displayText}
      {showHint && !copied && (
        <span className="copy-tooltip">{t('click_to_copy')}</span>
      )}
      {copied && <span className="copy-tooltip copied">{t('copied')}</span>}
    </button>
  )
}
