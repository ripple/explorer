import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Tabs from '../shared/components/Tabs'
import Map from './Map'
import NodesTable from './NodesTable'
import Log from '../shared/log'
import { localizeNumber } from '../shared/utils'

class NodesPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.fetchData()
    this.interval = setInterval(this.fetchData, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchData = () => {
    axios
      .get('/api/v1/nodes')
      .then((resp) => {
        const nodesWithLocations = resp.data.filter((node) => 'lat' in node)
        this.setState({
          nodes: resp.data,
          unmapped: resp.data.length - nodesWithLocations.length,
          locations: nodesWithLocations,
        })
      })
      .catch((e) => Log.error(e))
  }

  render() {
    const { nodes, locations, unmapped } = this.state
    const { path, t, language } = this.props
    const tabs = ['nodes', 'validators', 'upgrade_status']

    return (
      <div className="network-page">
        <Map nodes={nodes} locations={locations} />
        <div className="stat">
          {nodes && (
            <>
              <span>{t('nodes_found')}: </span>
              <span>
                {localizeNumber(nodes.length, language)}
                {unmapped ? (
                  <i>
                    {' '}
                    ({unmapped} {t('unmapped')})
                  </i>
                ) : null}
              </span>
            </>
          )}
        </div>
        <div className="wrap">
          <Tabs tabs={tabs} selected="nodes" path={path} />
          <NodesTable nodes={nodes} />
        </div>
      </div>
    )
  }
}

NodesPage.propTypes = {
  path: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

export default connect((state) => ({
  language: state.app.language,
}))(withTranslation()(NodesPage))
