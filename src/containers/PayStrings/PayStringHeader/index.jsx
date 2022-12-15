import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import PayStringLogomark from '../../shared/images/PayString_Logomark.png'
import { ReactComponent as QuestIcon } from '../../shared/images/hover_question.svg'
import Tooltip from '../../shared/components/Tooltip'
import '../../shared/css/nested-menu.scss'
import './styles.scss'

const PayStringHeader = (props) => {
  const [showToolTip, setShowToolTip] = useState(false)
  const questionRef = useRef(null)
  const { accountId, language } = props
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
      {showToolTip && (
        <Tooltip
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

PayStringHeader.propTypes = {
  accountId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
}

export default withTranslation()(PayStringHeader)
