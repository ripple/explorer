import React from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkTabs from './NetworkTabs'
import Map from './Map'
import NodesTable from './NodesTable'
import Log from '../shared/log'
import { FETCH_INTERVAL_NODES_MILLIS, localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'

const ENV_NETWORK_MAP = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
}

const semverCompare = (a = '', b = '') => {
  const chopa = a.split('+')[0]
  const chopb = b.split('+')[0]
  const pa = chopa.split('.')
  const pb = chopb.split('.')

  for (let i = 0; i < 3; i += 1) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (na > nb) return 1
    if (nb > na) return -1
    if (!isNaN(na) && isNaN(nb)) return 1
    if (isNaN(na) && !isNaN(nb)) return -1
  }

  return 0
}

const ledgerCompare = (a = 0, b = 0) => {
  // @ts-ignore
  const aLedger = a.validated_ledger ? a.validated_ledger.ledger_index : 0
  // @ts-ignore
  const bLedger = b.validated_ledger ? b.validated_ledger.ledger_index : 0
  return bLedger === aLedger
    ? // @ts-ignore
      semverCompare(b.version, a.version)
    : bLedger - aLedger
}

export const Nodes = () => {
  const language = useLanguage()
  const { t } = useTranslation()

  const { data } = useQuery(['fetchNodesData'], async () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_NODES_MILLIS,
  })

  const fetchData = async () => {
    // @ts-ignore
    const network = ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT]
    return axios
      .get(`${process.env.REACT_APP_DATA_URL}/topology/nodes/${network}`)
      .then((resp) => resp.data.nodes)
      .then((allNodes) => {
        const nodes = allNodes.map((node: any) => ({
          ...node,
          version: node.version.startsWith('rippled')
            ? node.version.split('-')[1]
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

        nodes.sort((a: any, b: any) => {
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
  }

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Map locations={data?.locations} />
      }
      <div className="stat">
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
