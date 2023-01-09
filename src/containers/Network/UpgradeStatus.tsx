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
import { StreamValidator, ValidatorResponse } from '../shared/vhsTypes'
import { getNetworkFromEnv } from '../shared/vhsUtils'

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
  const aggregation: Record<string, number> = {}
  validators.forEach((validator) => {
    if (validator.signing_key) {
      total += 1
      const version = validator.server_version
      if (version) {
        if (!aggregation[version]) {
          aggregation[version] = 1
        } else {
          aggregation[version] += 1
        }
      }
    }
  })

  return Object.entries(aggregation)
    .map(([version, count]) => ({
      label: version ? version.trim() : 'N/A',
      value: total > 0 ? (count * 100) / total : 0,
      count,
    }))
    .sort((a, b) => (isEarlierVersion(a.label, b.label) ? -1 : 1))
}

export const UpgradeStatus = () => {
  const [vList, setVList] = useState<Record<string, ValidatorResponse>>({})
  const [validations, setValidations] = useState<ValidatorResponse[]>([])
  const [unlCount, setUnlCount] = useState(0)
  const [aggregated, setAggregated] = useState<DataAggregation[]>([])
  const { t } = useTranslation()
  const language = useLanguage()

  useQuery(
    ['fetchUpgradeStatusData'],
    () => {
      fetchData()
    },
    {
      refetchInterval: FETCH_INTERVAL_MILLIS,
      refetchOnMount: true,
    },
  )

  const { data: stableVersion } = useQuery(
    ['stableVersion'],
    () => fetchStableVersion(),
    {
      placeholderData: null,
      retryDelay: FETCH_INTERVAL_MILLIS,
    },
  )

  const fetchData = () => {
    const network = getNetworkFromEnv()
    const url = `${process.env.REACT_APP_DATA_URL}/validators/${network}`

    axios
      .get(url)
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
        setAggregated(aggregateData(Object.values(newValidatorList)))
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
        <NetworkTabs selected="upgrade-status" />
        <div className="upgrade_status">
          <BarChartVersion data={aggregated} stableVersion={stableVersion} />
        </div>
      </div>
    </div>
  )
}
