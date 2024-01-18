import { useState, useRef } from 'react'
import PayStringLogomark from '../../shared/images/PayString_Logomark.png'
import QuestIcon from '../../shared/images/hover_question.svg'
import { Tooltip } from '../../shared/components/Tooltip/Tooltip'
import './styles.scss'

export interface PayStringHeaderProps {
  accountId: string
}

export const PayStringHeader = ({ accountId }: PayStringHeaderProps) => {
  const [showToolTip, setShowToolTip] = useState(false)
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
          tooltip={{
            mode: 'paystring',
            x: questionRef.current.getBoundingClientRect().x,
            y: questionRef.current.getBoundingClientRect().y,
          }}
        />
      )}
    </div>
  )
}
