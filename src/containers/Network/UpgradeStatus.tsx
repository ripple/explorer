import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import BarChartVersion from './BarChartVersion'
import Streams from '../shared/components/Streams'
import { Hexagons } from './Hexagons'
import {
  FETCH_INTERVAL_MILLIS,
  FETCH_INTERVAL_ERROR_MILLIS,
  localizeNumber,
  isEarlierVersion,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Log from '../shared/log'
import {
  NodeData,
  NodeResponse,
  StreamValidator,
  ValidatorResponse,
} from '../shared/vhsTypes'
import NetworkContext from '../shared/NetworkContext'
import { ledgerCompare } from './Nodes'
import { Loader } from '../shared/components/Loader'
import './css/style.scss'

interface NodeStats {
  nodePercent: number
  nodeCount: number
}

interface ValidatorStats {
  validatorPercent: number
  validatorCount: number
}

interface ValidatorAggregation {
  [label: string]: ValidatorStats
}

interface NodeAggregation {
  [label: string]: NodeStats
}

interface DataAggregation extends ValidatorStats, NodeStats {
  label: string
}

export const aggregateValidators = (validators: ValidatorResponse[]) => {
  let totalVals = 0
  const aggregation: ValidatorAggregation = {}
  validators?.forEach((validator) => {
    if (!validator.signing_key) return
    const version = validator.server_version
    totalVals += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { validatorCount: 0, validatorPercent: 0 }
      }
      aggregation[version].validatorCount += 1
    }
  })
  for (const label of Object.keys(aggregation)) {
    aggregation[label].validatorPercent =
      totalVals > 0 ? (aggregation[label].validatorCount / totalVals) * 100 : 0
  }

  return aggregation
}

export const aggregateNodes = (nodes: NodeResponse[]) => {
  let totalNodes = 0
  const aggregation: NodeAggregation = {}
  nodes?.forEach((node) => {
    const { version } = node
    if (!node.node_public_key) return
    totalNodes += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { nodeCount: 0, nodePercent: 0 }
      }
      aggregation[version].nodeCount += 1
    }
  })
  for (const label of Object.keys(aggregation)) {
    aggregation[label].nodePercent =
      totalNodes > 0 ? (aggregation[label].nodeCount / totalNodes) * 100 : 0
  }

  return aggregation
}

export const aggregateData = (
  validatorAggregation: ValidatorAggregation,
  nodeAggregation: NodeAggregation,
): DataAggregation[] => {
  const combinedAggregation: { [label: string]: ValidatorStats & NodeStats } =
    {}
  for (const label of Object.keys(validatorAggregation)) {
    combinedAggregation[label] = {
      validatorPercent: validatorAggregation[label].validatorPercent,
      validatorCount: validatorAggregation[label].validatorCount,
      nodePercent: 0,
      nodeCount: 0,
    }
  }

  for (const label of Object.keys(nodeAggregation)) {
    if (!combinedAggregation[label]) {
      combinedAggregation[label] = {
        validatorPercent: 0,
        validatorCount: 0,
        nodePercent: nodeAggregation[label].nodePercent,
        nodeCount: nodeAggregation[label].nodeCount,
      }
    } else {
      combinedAggregation[label].nodePercent =
        nodeAggregation[label].nodePercent
      combinedAggregation[label].nodeCount = nodeAggregation[label].nodeCount
    }
  }

  return Object.entries(combinedAggregation)
    .map(([label, stats]) => ({
      label,
      ...stats,
    }))
    .sort((a, b) => (isEarlierVersion(a.label, b.label) ? -1 : 1))
}

/**
 * Extracts the correct node version format from the source data.
 * (https://data.xrpl.org/v1/network/topology/nodes)
 *
 * Node versions often come in in this format:
 * rippled-[version]-[release (optional)]+[rippled hash (optional)]
 * Output format:
 * [version]-[release (optional)]
 * e.g. rippled-1.9.4+ba3c0e51455a88d76d90b996f20c0f102ac3f5a0.DEBUG should returns 1.9.4
 *      rippled-1.9.4-b1 should returns 1.9.4-b1
 *
 * @param version - The version retrieved from source data.
 * @returns - The correct version format.
 */
const handleNodeVersion = (version: string | undefined) => {
  let cleanedVersion = version
  if (version?.startsWith('rippled'))
    cleanedVersion = `${version.split('-').slice(1).join('-')}`
  if (version?.includes('+'))
    cleanedVersion = `${cleanedVersion?.split('+')[0]}`
  return cleanedVersion
}

export const UpgradeStatus = () => {
  const [validatorAggregation, setValidatorAggregation] =
    useState<ValidatorAggregation>({})
  const [nodeAggregation, setNodeAggregation] = useState<NodeAggregation>({})
  const network = useContext(NetworkContext)

  useQuery(
    ['fetchUpgradeStatusData'],
    () => {
      fetchData()
    },
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_MILLIS,
      refetchOnMount: true,
      enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
    },
  )

  const { data: stableVersion } = useQuery(
    ['stableVersion'],
    () => fetchStableVersion(),
    {
      placeholderData: null,
      retryDelay: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_MILLIS,
      refetchOnMount: true,
      enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
    },
  )

  const fetchData = () => {
    axios
      .get(`${process.env.VITE_DATA_URL}/validators/${network}`)
      .then((resp) => resp.data.validators)
      .then((validators: ValidatorResponse[]) => {
        const newValidatorList: Record<string, ValidatorResponse> = {}
        validators.forEach((validator) => {
          newValidatorList[validator.signing_key] = validator
        })
        setValidatorAggregation(aggregateValidators(validators))
        return Object.values(newValidatorList)
      })
      .catch((e) => Log.error(e))

    axios
      .get(`${process.env.VITE_DATA_URL}/topology/nodes/${network}`)
      .then((resp) => resp.data.nodes)
      .then((allNodes) => {
        const nodes: NodeData[] = allNodes.map((node: NodeResponse) => ({
          ...node,
          version: handleNodeVersion(node.version),
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

        setNodeAggregation(aggregateNodes(nodes))
        return nodes
      })
      .catch((e) => Log.error(e))
  }

  const fetchStableVersion = () => {
    const url = 'https://api.github.com/repos/XRPLF/rippled/releases'
    return axios
      .get(url)
      .then(
        (resp) =>
          resp.data.find(
            (release: any) => release.tag_name && !release.prerelease,
          )?.tag_name || null,
      )
  }

  return (
    <div className="network-page">
      <div className="wrap">
        {Object.keys(validatorAggregation).length > 0 ||
        Object.keys(nodeAggregation).length > 0 ? (
          <div className="upgrade_status">
            <BarChartVersion
              data={aggregateData(validatorAggregation, nodeAggregation)}
              stableVersion={stableVersion}
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}
