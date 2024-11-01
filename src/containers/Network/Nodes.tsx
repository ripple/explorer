import { useContext } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkTabs from './NetworkTabs'
import { Map } from './Map'
import { NodesTable } from './NodesTable'
import Log from '../shared/log'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_NODES_MILLIS,
  isEarlierVersion,
  localizeNumber,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import { NodeData, NodeResponse } from '../shared/vhsTypes'
import NetworkContext from '../shared/NetworkContext'

export const ledgerCompare = (a: NodeData, b: NodeData) => {
  const aLedger = a.validated_ledger.ledger_index
  const bLedger = b.validated_ledger.ledger_index
  const compareVersion = isEarlierVersion(b.version, a.version) ? -1 : 1
  return bLedger === aLedger ? compareVersion : bLedger - aLedger
}

export const Nodes = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const network = useContext(NetworkContext)

  const { data } = useQuery(['fetchNodesData'], async () => fetchData(), {
    refetchInterval: (returnedData, _) =>
      returnedData == null
        ? FETCH_INTERVAL_ERROR_MILLIS
        : FETCH_INTERVAL_NODES_MILLIS,
    enabled: !!network,
  })

  const fetchData = async () =>
    axios
      .get(`${process.env.VITE_DATA_URL}/topology/nodes/${network}`)
      .then((resp) => resp.data.nodes)
      .then((allNodes) => {
        const nodes: NodeData[] = allNodes.map((node: NodeResponse) => ({
          ...node,
          version: node.version?.startsWith('rippled')
            ? node.version.split('-').slice(1).join('-')
            : node.version,
          validated_ledger: {
            ledger_index: node.complete_ledgers
              ? Number(node.complete_ledgers.split('-')[1])
              : 0,
          },
          load_factor: node.load_factor_server
            ? Number(node.load_factor_server)
            : null,
        }))

        nodes.sort((a: NodeData, b: NodeData) => {
          if (a.server_state === b.server_state) {
            return ledgerCompare(a, b)
          }
          if (a.server_state && !b.server_state) {
            return -1
          }
          return 1
        })
        const nodesWithLocations = nodes.filter(
          (node: any) => 'lat' in node && 'long' in node,
        )
        return {
          nodes,
          unmapped: nodes.length - nodesWithLocations.length,
          locations: nodesWithLocations,
        }
      })
      .catch((e) => Log.error(e))

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Map locations={data?.locations} />
      }
      <div className="stat" data-testid="stat">
        {data?.nodes && (
          <>
            <span>{t('nodes_found')}: </span>
            <span>
              {localizeNumber(data?.nodes.length, language)}
              {data?.unmapped ? (
                <i>
                  {' '}
                  ({data?.unmapped} {t('unmapped')})
                </i>
              ) : null}
            </span>
          </>
        )}
      </div>
      <div className="wrap">
        <NetworkTabs selected="nodes" />
        <NodesTable nodes={data?.nodes} />
      </div>
    </div>
  )
}
