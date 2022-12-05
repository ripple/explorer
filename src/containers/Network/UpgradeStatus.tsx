import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import BarChartVersion from './BarChartVersion'
import NetworkTabs from './NetworkTabs'
import Streams from '../shared/components/Streams'
import Hexagons from './Hexagons'
import {
  localizeNumber,
  FETCH_INTERVAL_MILLIS,
  isEarlierVersion,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Log from '../shared/log'
import { ValidatorResponse } from './types'

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
}

interface DataAggregation {
  label: string
  value: number
  count: number
}

export const aggregateData = (
  validators: ValidatorResponse[],
): DataAggregation[] => {
  if (!validators) {
    return []
  }
  let total = 0
  const tempData: any[] = []
  validators.reduce((aggregate, current) => {
    const aggregation = { ...aggregate }
    if (current.signing_key) {
      const currentVersion = current.server_version
      // @ts-ignore
      if (currentVersion && !aggregation[currentVersion]) {
        // @ts-ignore
        aggregation[currentVersion] = {
          server_version: currentVersion,
          count: 0,
        }
        // @ts-ignore
        tempData.push(aggregation[currentVersion])
      }
      // @ts-ignore
      aggregation[currentVersion].count += 1
      total += 1
    }
    return aggregation
  }, {})

  if (tempData.length === 1 && !tempData[0].server_version) {
    return []
  }

  return tempData
    .map((item) => ({
      label: item.server_version ? item.server_version.trim() : 'N/A',
      value: (item.count * 100) / total,
      count: item.count,
    }))
    .sort((a, b) => (isEarlierVersion(a.label, b.label) ? -1 : 1))
}

export const UpgradeStatus = () => {
  const [vList, setVList] = useState<Record<string, ValidatorResponse>>({})
  const [validations, setValidations] = useState<ValidatorResponse[]>([])
  const [unlCount, setUnlCount] = useState(0)
  const [stableVersion, setStableVersion] = useState<string | null>(null)
  const [aggregated, setAggregated] = useState<DataAggregation[]>([])
  const { t } = useTranslation()
  const language = useLanguage()

  useQuery(
    ['fetchUpgradeStatusData'],
    () => {
      fetchData()
      fetchStableVersion()
    },
    {
      refetchInterval: FETCH_INTERVAL_MILLIS,
      refetchOnMount: true,
    },
  )

  const fetchData = () => {
    const network = ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT as string]
    const url = `${process.env.REACT_APP_DATA_URL}/validators/${network}`

    axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((validators) => {
        const newValidatorList: Record<string, ValidatorResponse> = {}
        validators.forEach((validator: ValidatorResponse) => {
          newValidatorList[validator.signing_key] = validator
        })

        setVList(newValidatorList)
        setUnlCount(
          validators.filter((validator: any) => Boolean(validator.unl)).length,
        )
        setAggregated(aggregateData(Object.values(newValidatorList)))
      })
      .catch((e) => Log.error(e))
  }

  const fetchStableVersion = () => {
    const url = 'https://api.github.com/repos/XRPLF/rippled/releases'
    axios.get(url).then((resp) => {
      resp.data.every((release: any) => {
        if (release.tag_name && !release.prerelease) {
          setStableVersion(release.tag_name)
          return false
        }
        return true
      })
    })
  }

  const updateValidators = (newValidations: any[]) => {
    // @ts-ignore - Work around type assignment for complex validation data types
    setValidations(newValidations)
    setVList((validatorList: any) => {
      const newValidatorsList: any = { ...validatorList }
      newValidations.forEach((validation: any) => {
        newValidatorsList[validation.pubkey] = {
          ...validatorList[validation.pubkey],
          ledger_index: validation.ledger_index,
          ledger_hash: validation.ledger_hash,
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
        <>
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
        </>
      </div>
      <div className="wrap">
        <NetworkTabs selected="upgrade_status" />
        <div className="upgrade_status">
          <BarChartVersion data={aggregated} stableVersion={stableVersion} />
        </div>
      </div>
    </div>
  )
}
