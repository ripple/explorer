import { FC, useState } from 'react'
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
const getLedgerHistory = (ledgers, range, MAX_WIDTH = 160) => {
  let count = 0
  let boxes = ''
  const min = Math.max(range[1] - 10000000, range[0])
  const diff = range[1] - min

  if (ledgers) {
    boxes = ledgers.map((l) => {
      const [low, high] = l
      const width = Math.min((high - low + 1) / diff, 1) * MAX_WIDTH
      const left = Math.max((low - min) / diff, 0) * MAX_WIDTH
      count += high - low
      return <div key={low} style={{ left, width }} />
    })
  }
  return { boxes, count }
}
const renderLedgerHistory = (ledgers, range) => {
  const MAX_WIDTH = 160

  if (ledgers) {
    const { boxes, count } = getLedgerHistory(ledgers, range, MAX_WIDTH)

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
  const [sortedField, setSortedField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const requestSort = (key) => {
    let direction = 'desc'
    if (sortedField === key && sortOrder === 'desc') {
      direction = 'asc'
    }
    setSortOrder(direction)
    setSortedField(key)
  }

  const { t } = useTranslation()
  const renderNode = (node) => (
    <tr key={node.node_public_key}>
      <td className={getClassNamesFor('pubkey text-truncate', 'pubkey')}>
        {node.node_public_key}
      </td>
      <td className={getClassNamesFor('ip text-truncate', 'ip')}>{node.ip}</td>
      <td className={getClassNamesFor('state center', 'server_state')}>
        <span className={node.server_state}>{node.server_state}</span>
      </td>
      <td className={getClassNamesFor('version', 'rippled_version')}>
        {getVersion(node.version)}
      </td>
      <td className={getClassNamesFor('last-ledger', 'last_ledger')}>
        {renderLastLedger(node.validated_ledger)}
      </td>
      <td className={getClassNamesFor('uptime', 'uptime')}>
        {durationToHuman(node.uptime)}
      </td>
      <td className={getClassNamesFor('peers right', 'peers')}>
        {node.inbound_count + node.outbound_count}
      </td>
      <td className="in-out">
        <small>
          ({node.inbound_count}:{node.outbound_count})
        </small>
      </td>
      <td className={getClassNamesFor('ledgers', 'ledger_history')}>
        {renderLedgerHistory(node.ledgers, ledgerRange)}
      </td>
      <td className={getClassNamesFor('quorum right', 'quorum')}>
        {node.quorum}
      </td>
      <td className={getClassNamesFor('load-factor right', 'load')}>
        {node.load_factor && node.load_factor > 1
          ? node.load_factor.toFixed(2)
          : ''}
      </td>
      <td className={getClassNamesFor('latency right', 'latency')}>
        {node.io_latency_ms && node.io_latency_ms > 1}
      </td>
    </tr>
  )

  const compareSemanticVersions = (
    a: string,
    b: string,
    returnValue: string,
  ) => {
    const a1 = a.split('.')
    const b1 = b.split('.')

    const len = Math.min(a1.length, b1.length)

    for (let i = 0; i < len; i++) {
      const a2 = +a1[i] || 0
      const b2 = +b1[i] || 0

      if (a2 !== b2) {
        return a2 > b2 ? returnValue : returnValue * -1
      }
    }
    return b1.length - a1.length
  }

  if (nodes !== null) {
    const sort = (key: any, order: string) => {
      const returnValue = order === 'desc' ? 1 : -1

      if (key === 'peers') {
        nodes.sort((a, b) =>
          a.inbound_count + a.outbound_count >
          b.inbound_count + b.outbound_count
            ? returnValue * -1
            : returnValue,
        )
      } else if (key === 'ledger_history') {
        nodes.sort((a, b) =>
          getLedgerHistory(a.ledgers, ledgerRange).count >
          getLedgerHistory(b.ledgers, ledgerRange).count
            ? returnValue * -1
            : returnValue,
        )
      } else if (key === 'rippled_version') {
        nodes.sort((a, b) =>
          compareSemanticVersions(a.version, b.version, returnValue),
        )
      } else {
        nodes.sort((a, b) => (a[key] > b[key] ? returnValue * -1 : returnValue))
      }
    }

    sort(sortedField, sortOrder)
  }

  const getClassNamesFor = (name, order) =>
    sortedField === order ? `${name} sorted` : name
  const getClassArrowFor = (field) => {
    if (sortedField === field && sortOrder === 'desc') {
      return 'arrow down'
    }
    if (sortedField === field && sortOrder === 'asc') {
      return 'arrow up'
    }
    return ''
  }

  const content = nodes ? (
    <table className="basic">
      <thead>
        <tr>
          <th className={getClassNamesFor('pubkey', 'pubkey')}>
            <a href="#" onClick={() => requestSort('pubkey')}>
              <i className={getClassArrowFor('pubkey')} />
              {t('node_pubkey')}
            </a>
          </th>
          <th className={getClassNamesFor('ip', 'ip')}>
            <a href="#" onClick={() => requestSort('ip')}>
              <i className={getClassArrowFor('ip')} />
              {t('ip')}
            </a>
          </th>
          <th
            className={getClassNamesFor('server-state center', 'server_state')}
          >
            <a href="#" onClick={() => requestSort('server_state')}>
              <i className={getClassArrowFor('server_state')} />
              {t('state')}
            </a>
          </th>
          <th className={getClassNamesFor('version', 'rippled_version')}>
            <a href="#" onClick={() => requestSort('rippled_version')}>
              <i className={getClassArrowFor('rippled_version')} />
              {t('rippled_version')}{' '}
            </a>
          </th>
          <th className={getClassNamesFor('last-ledger', 'last_ledger')}>
            <a href="#" onClick={() => requestSort('last_ledger')}>
              <i className={getClassArrowFor('last_ledger')} />
              {t('last_ledger')}
            </a>
          </th>
          <th className={getClassNamesFor('uptime', 'uptime')}>
            <a href="#" onClick={() => requestSort('uptime')}>
              <i className={getClassArrowFor('uptime')} />
              {t('uptime')}
            </a>
          </th>
          <th className={getClassNamesFor('peers right', 'peers')}>
            <a href="#" onClick={() => requestSort('peers')}>
              <i className={getClassArrowFor('peers')} />
              {t('peers')}
            </a>
          </th>
          <th className="in-out">
            <small>{t('in_out')}</small>
          </th>
          <th className={getClassNamesFor('ledgers', 'ledger_history')}>
            <a href="#" onClick={() => requestSort('ledger_history')}>
              <i className={getClassArrowFor('ledger_history')} />
              {t('ledger_history')}
            </a>
          </th>
          <th className={getClassNamesFor('quorum right', 'quorum')}>
            <a href="#" onClick={() => requestSort('quorum')}>
              <i className={getClassArrowFor('quorum')} />
              {t('quorum')}
            </a>
          </th>
          <th className={getClassNamesFor('load-factor right', 'load')}>
            <a href="#" onClick={() => requestSort('load')}>
              <i className={getClassArrowFor('load')} />
              {t('load')}
            </a>
          </th>
          <th className={getClassNamesFor('latency right', 'latency')}>
            <a href="#" onClick={() => requestSort('latency')}>
              <i className={getClassArrowFor('latency')} />
              {t('latency')}
            </a>
          </th>
        </tr>
      </thead>
      <tbody>{nodes.map(renderNode)}</tbody>
    </table>
  ) : (
    <Loader />
  )

  return <div className="nodes-table">{content}</div>
}
