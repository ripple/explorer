import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import PayStringLogomark from '../../shared/images/PayString_Logomark.png'
import QuestIcon from '../../shared/images/hover_question.svg'
import Tooltip from '../../shared/components/Tooltip'
import './styles.scss'
import { useLanguage } from '../../shared/hooks'

export interface PayStringHeaderProps {
  accountId: string
}

export const PayStringHeader = ({ accountId }: PayStringHeaderProps) => {
  const [showToolTip, setShowToolTip] = useState(false)
  const { t } = useTranslation()
  const language = useLanguage()
  const questionRef = useRef<Element>(null)
  return (
    <div className="box paystring-header">
      <div className="box-header">
        <img
          src={PayStringLogomark}
          alt="PayString"
          className="paystring-logomark"
        />
        <div className="paystring-id">{accountId}</div>
        <QuestIcon
          ref={questionRef}
          alt="PayString"
          className="question"
          onMouseOver={() => setShowToolTip(true)}
          onFocus={() => setShowToolTip(true)}
          onMouseOut={() => setShowToolTip(false)}
          onBlur={() => setShowToolTip(false)}
        />
      </div>
      {showToolTip && questionRef.current && (
        <Tooltip
          t={t}
          language={language}
          data={{
            mode: 'paystring',
            x: questionRef.current.getBoundingClientRect().x,
            y: questionRef.current.getBoundingClientRect().y,
          }}
        />
      )}
    </div>
  )
}
