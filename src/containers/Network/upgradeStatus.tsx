import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteMatch } from 'react-router'
import axios from 'axios'
import BarChartVersion from './BarChartVersion'
import NetworkTabs from './NetworkTab'
import Streams from '../shared/components/Streams'
import Hexagons from './Hexagons'
import { localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Log from '../shared/log'

const UpgradeStatus = () => {
  const [vList, setVList] = useState<any>([{}])
  const [validations, setValidations] = useState([])
  const [unlCount, setUnlCount] = useState(0)
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
  const language = useLanguage()

  const aggregateData = (v: any[]) => {
    if (!v) {
      return []
    }
    let total = 0
    const tempData: any[] = []
    v.reduce((res, val) => {
      if (!res[val.server_version]) {
        res[val.server_version] = {
          server_version: val.server_version,
          count: 0,
        }
        tempData.push(res[val.server_version])
      }
      res[val.server_version].count += 1
      total += 1
      return res
    }, {})

    return tempData
      .map((item) => ({
        label: item.server_version ? item.server_version : ' NA ',
        value: (item.count * 100) / total,
        count: item.count,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : -1))
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchData = () => {
    const url = '/api/v1/validators?verbose=true'

    axios
      .get(url)
      .then((resp) => {
        const newValidatorList: any = {}
        resp.data.forEach((v: any) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => newValidatorList)
        setUnlCount(resp.data.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidations: any[]) => {
    // @ts-ignore
    setValidations(newValidations)
    setVList((value: any) => {
      const newValidatorsList: any = { ...value }
      newValidations.forEach((validation: any) => {
        newValidatorsList[validation.pubkey] = {
          ...value[validation.pubkey],
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
      {validatorCount && (
        // @ts-ignore
        <Hexagons data={validations} list={vList} />
      )}

      <div className="stat">
        {validatorCount && (
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
        )}
      </div>

      <div className="wrap">
        <NetworkTabs selected="upgrade-status" path={path} />
        <div className="upgrade-status">
          {vList && (
            <BarChartVersion data={aggregateData(Object.values(vList))} />
          )}
        </div>
      </div>
    </div>
  )
}

export default UpgradeStatus
