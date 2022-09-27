import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import BarChartVersion from './BarChartVersion'
import NetworkTabs from './NetworkTabs'
import Streams from '../shared/components/Streams'
import Hexagons from './Hexagons'
import { localizeNumber, FETCH_INTERVAL_MILLIS } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Log from '../shared/log'

export const aggregateData = (validators: any[]) => {
  if (!validators) {
    return []
  }
  let total = 0
  const tempData: any[] = []
  validators.reduce((aggregate, current) => {
    const aggregation = { ...aggregate }
    if (current.signing_key) {
      const currentVersion = current.server_version ?? null
      if (!aggregation[currentVersion]) {
        aggregation[currentVersion] = {
          server_version: currentVersion,
          count: 0,
        }
        tempData.push(aggregation[currentVersion])
      }
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
      label: item.server_version ? item.server_version : ' N/A ',
      value: (item.count * 100) / total,
      count: item.count,
    }))
    .sort((a, b) => (a.label > b.label ? 1 : -1))
}

export const UpgradeStatus = () => {
  const [vList, setVList] = useState<any>([])
  const [validations, setValidations] = useState([])
  const [unlCount, setUnlCount] = useState(0)
  const [stableVersion, setStableVersion] = useState<string | null>(null)
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
    },
  )

  const fetchData = () => {
    const url = '/api/v1/validators?verbose=true'

    axios
      .get(url)
      .then((resp) => {
        const newValidatorList: any = {}
        resp.data.forEach((validator: any) => {
          newValidatorList[validator.signing_key] = validator
        })

        setVList(newValidatorList)
        setUnlCount(
          resp.data.filter((validator: any) => Boolean(validator.unl)).length,
        )
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
          <BarChartVersion
            data={aggregateData(Object.values(vList))}
            stableVersion={stableVersion}
          />
        </div>
      </div>
    </div>
  )
}
