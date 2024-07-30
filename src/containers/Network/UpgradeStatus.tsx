import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import BarChartVersion from './BarChartVersion'
import NetworkTabs from './NetworkTabs'
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

interface NodeStats {
  nodesPercent: number
  nodesCount: number
}

interface ValidatorStats {
  validatorsPercent: number
  validatorsCount: number
}

interface ValidatorsAggregation {
  [label: string]: ValidatorStats
}

interface NodesAggregation {
  [label: string]: NodeStats
}

interface DataAggregation extends ValidatorStats, NodeStats {
  label: string
}

export const aggregateValidators = (validators: ValidatorResponse[]) => {
  let totalVals = 0
  const aggregation: ValidatorsAggregation = {}
  validators?.forEach((validator) => {
    if (!validator.signing_key) return
    const version = validator.server_version
    totalVals += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { validatorsCount: 0, validatorsPercent: 0 }
      }
      aggregation[version].validatorsCount += 1
    }
  })
  for (const label of Object.keys(aggregation)) {
    aggregation[label].validatorsPercent =
      totalVals > 0 ? (aggregation[label].validatorsCount / totalVals) * 100 : 0
  }

  return aggregation
}

export const aggregateNodes = (nodes: NodeResponse[]) => {
  let totalNodes = 0
  const aggregation: NodesAggregation = {}
  nodes?.forEach((node) => {
    const { version } = node
    if (!node.node_public_key) return
    totalNodes += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { nodesCount: 0, nodesPercent: 0 }
      }
      aggregation[version].nodesCount += 1
    }
  })
  for (const label of Object.keys(aggregation)) {
    aggregation[label].nodesPercent =
      totalNodes > 0 ? (aggregation[label].nodesCount / totalNodes) * 100 : 0
  }

  return aggregation
}

export const aggregateData = (
  validatorsAggregation: ValidatorsAggregation,
  nodesAggregation: NodesAggregation,
): DataAggregation[] => {
  const combinedAggregation: { [label: string]: ValidatorStats & NodeStats } =
    {}
  for (const label of Object.keys(validatorsAggregation)) {
    combinedAggregation[label] = {
      validatorsPercent: validatorsAggregation[label].validatorsPercent,
      validatorsCount: validatorsAggregation[label].validatorsCount,
      nodesPercent: 0,
      nodesCount: 0,
    }
  }

  for (const label of Object.keys(nodesAggregation)) {
    if (!combinedAggregation[label]) {
      combinedAggregation[label] = {
        validatorsPercent: 0,
        validatorsCount: 0,
        nodesPercent: nodesAggregation[label].nodesPercent,
        nodesCount: nodesAggregation[label].nodesCount,
      }
    } else {
      combinedAggregation[label].nodesPercent =
        nodesAggregation[label].nodesPercent
      combinedAggregation[label].nodesCount = nodesAggregation[label].nodesCount
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
  const [vList, setVList] = useState<Record<string, ValidatorResponse>>({})
  const [validations, setValidations] = useState<ValidatorResponse[]>([])
  const [unlCount, setUnlCount] = useState(0)
  const [validatorsAggregation, setValidatorsAggregation] =
    useState<ValidatorsAggregation>({})
  const [nodesAggregation, setNodesAggregation] = useState<NodesAggregation>({})
  const { t } = useTranslation()
  const language = useLanguage()
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
        setVList(newValidatorList)
        setUnlCount(
          validators.filter((validator) => Boolean(validator.unl)).length,
        )
        setValidatorsAggregation(aggregateValidators(validators))
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

        setNodesAggregation(aggregateNodes(nodes))
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

  const updateValidators = (newValidations: StreamValidator[]) => {
    setValidations(newValidations)
    setVList((validatorList) => {
      const newValidatorsList: Record<string, StreamValidator> = {
        ...validatorList,
      }
      newValidations.forEach((validation) => {
        if (validation.pubkey) {
          newValidatorsList[validation.pubkey] = {
            ...validatorList[validation.pubkey],
            ledger_index: validation.ledger_index,
            ledger_hash: validation.ledger_hash,
          }
        }
      })
      return newValidatorsList
    })
  }

  const validatorCount = Object.keys(vList).length

  return (
    <div className="network-page">
      <Streams validators={vList} updateValidators={updateValidators} />
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Hexagons data={validations} list={vList} />
      }
      <div className="stat">
        <span>{t('validators_found')}: </span>
        <span>
          {localizeNumber(validatorCount, language)}
          {unlCount !== 0 && (
            <i>
              {' '}
              ({t('unl')}: {unlCount})
            </i>
          )}
        </span>
      </div>
      <div className="wrap">
        <NetworkTabs selected="upgrade-status" />
        {Object.keys(validatorsAggregation).length > 0 ||
        Object.keys(nodesAggregation).length > 0 ? (
          <div className="upgrade_status">
            <BarChartVersion
              data={aggregateData(validatorsAggregation, nodesAggregation)}
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
