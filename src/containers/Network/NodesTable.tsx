import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import { durationToHuman } from '../shared/utils'
import { NodeData } from '../shared/vhsTypes'
import './css/nodesTable.scss'
import { LEDGER_ROUTE } from '../App/routes'
import { RouteLink } from '../shared/routing'

const renderLastLedger = (ledger) =>
  ledger && ledger.ledger_index ? (
    <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledger.ledger_index }}>
      {ledger.ledger_index}
    </RouteLink>
  ) : (
    <i>unknown</i>
  )

const renderLedgerHistory = (ledgers, range) => {
  let count = 0
  const MAX_WIDTH = 160
  const min = Math.max(range[1] - 10000000, range[0])
  const diff = range[1] - min

  if (ledgers) {
    const boxes = ledgers.map((l) => {
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
    if (d.complete_ledgers != null && typeof d.complete_ledgers === 'string') {
      const ranges = d.complete_ledgers.split(',')
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

const getVersion = (version) => {
  if (version && version.includes('+')) {
    return `${version.split('+')[0]}*`
  }
  return version
}

export const NodesTable: FC<{ nodes: NodeData[] }> = ({
  nodes: unformattedNodes,
}) => {
  const nodes = unformattedNodes ? formatLedgerHistory(unformattedNodes) : null
  const ledgerRange = nodes && getLedgerRange(nodes)

  const { t } = useTranslation()
  const renderNode = (node) => (
    <tr key={node.node_public_key}>
      <td className="pubkey text-truncate">{node.node_public_key}</td>
      <td className="ip text-truncate">{node.ip}</td>
      <td className="state center">
        <span className={node.server_state}>{node.server_state}</span>
      </td>
      <td className="version">{getVersion(node.version)}</td>
      <td className="last-ledger">{renderLastLedger(node.validated_ledger)}</td>
      <td className="uptime">{durationToHuman(node.uptime)}</td>
      <td className="peers right">
        {node.inbound_count + node.outbound_count}
      </td>
      <td className="in-out">
        <small>
          ({node.inbound_count}:{node.outbound_count})
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
      <td className="latency right">
        {node.io_latency_ms && node.io_latency_ms > 1}
      </td>
    </tr>
  )

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
      <tbody>{nodes.map(renderNode)}</tbody>
    </table>
  ) : (
    <Loader />
  )

  return <div className="nodes-table">{content}</div>
}
