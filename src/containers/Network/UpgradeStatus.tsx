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

interface DataAggregation {
  label: string
  validatorsPercent: number
  validatorsCount: number
  nodesPercent: number
  nodesCount: number
}

export const aggregateData = (
  validators: ValidatorResponse[],
  nodes: NodeResponse[],
): DataAggregation[] => {
  if (!validators) {
    return []
  }

  let totalVals = 0
  let totalNodes = 0
  interface aggregationTypes {
    validatorsCount: number
    nodesCount: number
  }

  const aggregation: Record<string, aggregationTypes> = {}
  validators?.forEach((validator) => {
    if (!validator.signing_key) return
    const version = validator.server_version
    totalVals += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { validatorsCount: 0, nodesCount: 0 }
      }
      aggregation[version].validatorsCount += 1
    }
  })

  nodes?.forEach((node) => {
    const { version } = node
    if (!node.node_public_key) return
    totalNodes += 1
    if (version) {
      if (!aggregation[version]) {
        aggregation[version] = { validatorsCount: 0, nodesCount: 0 }
      }
      aggregation[version].nodesCount += 1
    }
  })

  return Object.entries(aggregation)
    .map(([version, counts]) => ({
      label: version ? version.trim() : 'N/A',
      validatorsPercent:
        totalVals > 0 ? (counts.validatorsCount * 100) / totalVals : 0,
      validatorsCount: counts.validatorsCount,
      nodesPercent: totalNodes > 0 ? (counts.nodesCount * 100) / totalNodes : 0,
      nodesCount: counts.nodesCount,
    }))
    .sort((a, b) => (isEarlierVersion(a.label, b.label) ? -1 : 1))
}

const handleNodeVersion = (version: string | undefined) => {
  let cleanedVersion = version
  if (version?.startsWith('rippled'))
    cleanedVersion = `${version.split('-')[1]}`
  if (version?.includes('+'))
    cleanedVersion = `${cleanedVersion?.split('+')[0]}`
  return cleanedVersion
}

export const UpgradeStatus = () => {
  const [vList, setVList] = useState<Record<string, ValidatorResponse>>({})
  const [validations, setValidations] = useState<ValidatorResponse[]>([])
  const [unlCount, setUnlCount] = useState(0)
  const [aggregated, setAggregated] = useState<DataAggregation[]>([])
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
    const validatorsReq = axios
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
        return Object.values(newValidatorList)
      })
      .catch((e) => Log.error(e))

    const nodesReq = axios
      .get(`${process.env.VITE_DATA_URL}/topology/nodes/${network}`)
      .then((resp) => resp.data.nodes)
      .then((allNodes) => {
        const nodes: NodeData[] = allNodes.map((node: NodeResponse) => ({
          ...node,
          version: handleNodeVersion(node?.version),
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
        return nodes
      })
      .catch((e) => Log.error(e))
    Promise.all([validatorsReq, nodesReq]).then(([validators, nodes]) => {
      setAggregated(aggregateData(validators, nodes))
    })
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
        <div className="upgrade_status">
          <BarChartVersion data={aggregated} stableVersion={stableVersion} />
        </div>
      </div>
    </div>
  )
}
