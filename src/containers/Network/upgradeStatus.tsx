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

const mergeLatest = (validators: any[] = [], live: any[] = []) => {
  const latest: any = {}
  live.forEach((d) => {
    latest[d.pubkey] = {
      ledger_index: d.ledger_index,
      ledger_hash: d.ledger_hash,
    }
  })

  return validators.map((d) => {
    const updated: any = {}
    if (
      latest[d.signing_key] &&
      latest[d.signing_key].ledger_index > d.ledger_index
    ) {
      updated.ledger_index = latest[d.signing_key].ledger_index
      updated.ledger_hash = latest[d.signing_key].ledger_hash
    }

    return Object.assign(d, updated)
  })
}

const UpgradeStatus = () => {
  const [vList, setVList] = useState({})
  const [liveValidators, setLiveValidators] = useState([])
  const [unlCount, setUnlCount] = useState(0)
  const [validators, setValidators] = useState([])
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

  liveValidators.slice(0, 1)
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
        const newVList: any = {}
        resp.data.forEach((v: any) => {
          newVList[v.signing_key] = {
            signing_key: v.signing_key,
            master_key: v.master_key,
            unl: v.unl,
            domain: v.domain,
          }
        })

        setVList(newVList)
        // @ts-ignore
        setValidators((prevValidators: any[]) =>
          mergeLatest(resp.data, prevValidators),
        )
        setUnlCount(resp.data.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidators: any[]) => {
    // @ts-ignore
    setLiveValidators(newValidators)
    // @ts-ignore
    setValidators((prevValidators: any[]) =>
      mergeLatest(prevValidators, newValidators),
    )
  }

  return (
    <div className="network-page">
      <Streams validators={vList} updateValidators={updateValidators} />
      {
        // @ts-ignore
        validators.length && <Hexagons data={liveValidators} list={vList} />
      }

      <div className="stat">
        {validators && (
          <>
            <span>{t('validators_found')}: </span>
            <span>
              {localizeNumber(validators.length, language)}
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
          {validators && <BarChartVersion data={aggregateData(validators)} />}
        </div>
      </div>
    </div>
  )
}

export default UpgradeStatus
