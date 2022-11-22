import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Validators } from './Validators'
import { UpgradeStatus } from './UpgradeStatus'
import { Nodes } from './Nodes'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import './css/style.scss'

class Network extends Component {
  componentDidMount() {
    const { t, match } = this.props
    const { params } = match
    document.title = `${t('xrpl_explorer')} | ${t('network')}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'network',
      path: `/network/${params.tab || 'nodes'}`,
    })
  }

  render() {
    const { match } = this.props
    const { params, path } = match
    const { tab = 'nodes' } = params

    // strips :url from the front and the tab info from the end
    const base = path.split('/:')[0]

    if (tab === 'upgrade-status') {
      return <UpgradeStatus path={base} />
    }
    if (tab === 'validators') {
      return <Validators path={base} />
    }
    return <Nodes path={base} />
  }
}

Network.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      identifier: PropTypes.string,
      tab: PropTypes.string,
    }),
  }).isRequired,
}

export default withTranslation()(Network)
