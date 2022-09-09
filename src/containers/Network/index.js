import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Validators from './Validators'
import Nodes from './Nodes'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import './css/style.scss'
import NoMatch from '../NoMatch'

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

  renderUnderConstruction = () => (
    <div className="network-page">
      <NoMatch
        title="under_construction"
        hints={['come_back_later']}
        isError={false}
      />
    </div>
  )

  render() {
    const { match } = this.props
    const { params, path } = match
    const { tab = 'nodes' } = params
    const mode = process.env.REACT_APP_ENVIRONMENT
    if (mode === 'sidechain') {
      return this.renderUnderConstruction()
    }
    // strips :url from the front and the tab info from the end
    const base = path.split('/:')[0]
    return tab === 'nodes' ? <Nodes path={base} /> : <Validators path={base} />
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
