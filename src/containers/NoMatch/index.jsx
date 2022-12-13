import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import infoIcon from '../shared/images/info_orange.png'
import './nomatch.scss'

class NoMatch extends Component {
  componentDidMount() {
    const { t, title, hints } = this.props
    document.title = `${t('xrpl_explorer')} | ${t(title)}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: `${title} -- ${hints.join(', ')}`,
      path: '/404',
    })
  }

  render() {
    const { t, title, hints, isError = true } = this.props
    const notFound = title.includes('not_found')
    const hintMsg = hints.map((hint) => (
      <div className="hint" key={hint}>
        {t(hint)}
      </div>
    ))

    return (
      <div className="no-match">
        {isError && <div className="uh-oh">{t('404_uh_oh')}</div>}
        <div className="title">{t(title)}</div>
        {hintMsg}
        <div className="warning">
          <img src={infoIcon} alt="not found" />
          <span>{notFound && t('not_found')}</span>
        </div>
      </div>
    )
  }
}

NoMatch.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string,
  hints: PropTypes.arrayOf(PropTypes.string),
  isError: PropTypes.bool,
}

NoMatch.defaultProps = {
  title: '404_default_title',
  hints: ['404_check_url'],
  isError: true,
}

export default withTranslation()(NoMatch)
