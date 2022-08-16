import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Loader from '../shared/components/Loader'
import { durationToHuman } from '../shared/utils'
import './css/nodesTable.scss'

const renderLastLedger = (ledger) =>
  ledger ? (
    <Link
      style={{
        color: `#${
          ledger.ledger_hash ? ledger.ledger_hash.substr(0, 6) : '9ba2b0'
        }`,
      }}
      to={`/ledgers/${ledger.ledger_index}`}
    >
      {ledger.ledger_index}
    </Link>
  ) : (
    <i>unknown</i>
  )

const renderLedgerHistory = (ledgers, range) => {
  let count = 0
  const MAX_WIDTH = 160
  const min = Math.max(range[1] - 10000000, range[0])
  const diff = range[1] - min

  if (ledgers) {
    const boxes = ledgers.map((l, i) => {
      const [low, high] = l
      const width = Math.min((high - low + 1) / diff, 1) * MAX_WIDTH
      const left = Math.max((low - min) / diff, 0) * MAX_WIDTH
      count += high - low
      return <div key={low} style={{ left, width }} />
    })

    if (count < 0) {
      return null
    }

    return (
      <>
        <div className="boxes" style={{ width: MAX_WIDTH }}>
          {boxes}
        </div>
        <span>{`~${durationToHuman(count * 3.55, 0)}`}</span>
      </>
    )
  }

  return null
}

const formatLedgerHistory = (nodes) =>
  nodes.map((d) => {
    if (d.ledgers && typeof d.ledgers === 'string') {
      const ranges = d.ledgers.split(',')
      const ledgers = ranges
        .map((l) => {
          const local = l.split('-')
          const low = Number(local[0])
          return isNaN(low) ? undefined : [low, Number(local[1] || local[0])]
        })
        .filter((l) => Boolean(l))

      return { ...d, ledgers }
    }

    return { ...d }
  })

const getLedgerRange = (data) => {
  let min = Infinity
  let max = 0
  data.forEach((d) => {
    if (d.ledgers) {
      d.ledgers.forEach((l) => {
        const [low, high] = l
        if (low < min) {
          min = low
        }

        if (high > max) {
          max = high
        }
      })
    }
  })

  return [min, max]
}

class NodesTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nodes = nextProps.nodes ? formatLedgerHistory(nextProps.nodes) : null
    return {
      ledgerRange: nodes && getLedgerRange(nodes),
      nodes,
    }
  }

  renderNode = (node) => {
    const { ledgerRange } = this.state
    return (
      <tr key={node.pubkey_node}>
        <td className="pubkey text-truncate">{node.pubkey_node}</td>
        <td className="host text-truncate">{node.host}</td>
        <td className="state center">
          <span className={node.server_state}>{node.server_state}</span>
        </td>
        <td className="version">{node.version}</td>
        <td className="last-ledger">
          {renderLastLedger(node.validated_ledger)}
        </td>
        <td className="uptime">{durationToHuman(node.uptime)}</td>
        <td className="peers right">{node.in + node.out}</td>
        <td className="in-out">
          <small>
            ({node.in}:{node.out})
          </small>
        </td>
        <td className="ledgers">
          {renderLedgerHistory(node.ledgers, ledgerRange)}
        </td>
        <td className="quorum right">{node.quorum}</td>
        <td className="load-factor right">
          {node.load_factor && node.load_factor > 1
            ? node.load_factor.toFixed(2)
            : ''}
        </td>
        <td className="latency right">{node.latency && node.latency > 1}</td>
      </tr>
    )
  }

  render() {
    const { t } = this.props
    const { nodes } = this.state
    const content = nodes ? (
      <table className="basic">
        <thead>
          <tr>
            <th className="pubkey">{t('node_pubkey')}</th>
            <th className="ip">{t('ip')}</th>
            <th className="server-state center">{t('state')}</th>
            <th className="version">{t('rippled_version')}</th>
            <th className="last-ledger">{t('last_ledger')}</th>
            <th className="uptime">{t('uptime')}</th>
            <th className="peers right">{t('peers')}</th>
            <th className="in-out">
              <small>{t('in_out')}</small>
            </th>
            <th className="ledgers">{t('ledger_history')}</th>
            <th className="quorum right">{t('quorum')}</th>
            <th className="load-factor right">{t('load')}</th>
            <th className="latency right">{t('latency')}</th>
          </tr>
        </thead>
        <tbody>{nodes.map(this.renderNode)}</tbody>
      </table>
    ) : (
      <Loader />
    )

    return <div className="nodes-table">{content}</div>
  }
}

NodesTable.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  t: PropTypes.func.isRequired,
}

NodesTable.defaultProps = {
  nodes: null,
}

export default withTranslation()(NodesTable)
