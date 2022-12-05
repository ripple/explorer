import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import axios from 'axios'
import Log from '../shared/log'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import Streams from '../shared/components/Streams'
import LedgerMetrics from './LedgerMetrics'
import Ledgers from './Ledgers'

const FETCH_INTERVAL_MILLIS = 5 * 60 * 1000

interface ValidatorResponse {
  // eslint-disable-next-line camelcase -- from VHS
  signing_key: string
  // eslint-disable-next-line camelcase -- from VHS
  master_key: string
  unl: string
  domain: string | null
}

const LedgersPage = () => {
  const [validators, setValidators] = useState<
    Record<string, ValidatorResponse>
  >({})
  const [ledgers, setLedgers] = useState([])
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [metrics, setMetrics] = useState(undefined)
  const [unlCount, setUnlCount] = useState<number | undefined>(undefined)
  const { t, i18n } = useTranslation()

  document.title = `${t('xrpl_explorer')} | ${t('ledgers')}`

  useEffect(() => {
    /* @ts-ignore */
    analytics(ANALYTIC_TYPES.pageview, { title: 'Ledgers', path: '/' })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [])

  const fetchValidators = () => {
    const url = `/api/v1/validators`

    axios
      .get(url)
      .then((resp) => {
        const newValidators: Record<string, ValidatorResponse> = {}
        let newUnlCount = 0

        resp.data.forEach((v: ValidatorResponse) => {
          if (v.unl === process.env.REACT_APP_VALIDATOR) {
            newUnlCount += 1
          }
          newValidators[v.signing_key] = v
        })

        setValidators(newValidators)
        setUnlCount(newUnlCount)
      })
      .catch((e) => Log.error(e))
  }

  useQuery(['fetchValidatorData'], async () => fetchValidators(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
  })

  const updateSelected = (pubkey: string) => {
    setSelected(selected === pubkey ? null : pubkey)
  }

  const pause = () => setPaused(!paused)

  const { language } = i18n

  return (
    <div className="ledgers-page">
      <Streams
        validators={validators}
        updateLedgers={setLedgers}
        updateMetrics={setMetrics}
      />
      <LedgerMetrics
        language={language}
        data={metrics}
        onPause={() => pause()}
        paused={paused}
      />
      <Ledgers
        language={language}
        ledgers={ledgers}
        validators={validators}
        unlCount={unlCount}
        selected={selected}
        setSelected={updateSelected}
        paused={paused}
      />
    </div>
  )
}

export default LedgersPage
