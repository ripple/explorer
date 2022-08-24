import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
// import BarChart from '../shared/components/BarChart'
import Tabs from '../shared/components/Tabs'
import Streams from '../shared/components/Streams'
import Hexagons from './Hexagons'
import Log from '../shared/log'

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vList: {},
      liveValidators: [],
      metrics: {},
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  // ensure the latest reported ledger is shown
  mergeLatest = (validators = [], live = []) => {
    const latest = {}
    live.forEach((d) => {
      latest[d.pubkey] = {
        ledger_index: d.ledger_index,
        ledger_hash: d.ledger_hash,
      }
    })

    return validators.map((d) => {
      const updated = {}
      if (
        latest[d.signing_key] &&
        latest[d.signing_key].ledger_index > d.ledger_index
      ) {
        updated.ledger_index = latest[d.signing_key].ledger_index
        updated.ledger_hash = latest[d.signing_key].ledger_hash
      }

      return Object.assign(d, updated)
    })
  }

  updateValidators = (liveValidators) =>
    this.setState((prevState) => ({
      liveValidators,
      validators: this.mergeLatest(prevState.validators, liveValidators),
    }))

  updateMetrics = (metrics) => {
    this.setState({ metrics })
  }

  aggregateData = (validators) => {
    if (!validators) {
      return []
    }
    let total = 0
    const tempData = []
    validators.reduce((res, val) => {
      if (!res[val.server_version]) {
        res[val.server_version] = {
          server_version: val.server_version,
          count: 0,
        }
        tempData.push(res[val.server_version])
      }
      res[val.server_version].count += 1
      total += 1
      return res
    }, {})

    return tempData.map((item) => ({
      label: item.server_version,
      value: (item.count * 100) / total,
    }))
  }

  fetchData = () => {
    const url = '/api/v1/validators?verbose=true'

    axios
      .get(url)
      .then((resp) => {
        const vList = {}
        resp.data.forEach((v) => {
          vList[v.signing_key] = {
            signing_key: v.signing_key,
            master_key: v.master_key,
            unl: v.unl,
            domain: v.domain,
          }
        })

        this.setState((prevState) => ({
          vList,
          validators: this.mergeLatest(resp.data, prevState.liveValidators),
        }))
      })
      .catch((e) => Log.error(e))
  }

  render() {
    const { validators, vList, liveValidators, metrics } = this.state
    console.log(validators)
    const { path } = this.props
    const tabs = ['nodes', 'validators', 'chart']
    const data = {}
    data.width = 500
    data.height = 750
    data.dataSet = this.aggregateData(validators)
    data.margins = { top: 20, right: 10, bottom: 0, left: 10 }
    data.yAxisLabel = 'Y VALUE'
    data.ticks = 10
    data.barClass = 'barChart'
    return (
      <div className="network-page">
        <div className="test">
          <Streams
            validators={vList}
            updateValidators={this.updateValidators}
            updateMetrics={this.updateMetrics}
          />
          <Hexagons data={liveValidators} list={vList} />
        </div>
        <div className="wrap">
          <Tabs tabs={tabs} selected="chart" path={path} />
          {/* <div className="chart" style={{ color: 'red' }}>
            {validators && <BarChart data={data} />}
          </div> */}
        </div>
      </div>
    )
  }
}

Chart.propTypes = {
  path: PropTypes.string.isRequired,
}

export default Chart
