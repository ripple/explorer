import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouteMatch } from 'react-router'
import Tabs from '../shared/components/Tabs'
import Streams from '../shared/components/Streams'
import ValidatorsTable from './ValidatorsTable'
import Log from '../shared/log'
import { localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Hexagons from './Hexagons'

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
export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()

  const [vList, setVList] = useState({})
  const [liveValidators, setLiveValidators] = useState([])
  const [metrics, setMetrics] = useState({})
  const [validators, setValidators] = useState([])
  const [unlCount, setUnlCount] = useState(0)
  const { path = '/' } = useRouteMatch()

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

  const tabs = ['nodes', 'validators', 'chart']
  // @ts-ignore

  return (
    <div className="network-page">
      <Streams
        validators={vList}
        updateValidators={updateValidators}
        updateMetrics={setMetrics}
      />
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
        <Tabs tabs={tabs} selected="validators" path={path} />
        <ValidatorsTable validators={validators} metrics={metrics} />
      </div>
    </div>
  )
}
