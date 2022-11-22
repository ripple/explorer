import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation, withTranslation } from 'react-i18next'
import axios from 'axios'
import Log from '../shared/log'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import Streams from '../shared/components/Streams'
import LedgerMetrics from './LedgerMetrics'
import Ledgers from './Ledgers'

const LedgersPage = () => {
  const [validators, setValidators] = useState({})
  const [ledgers, setLedgers] = useState([])
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(undefined)
  const [metrics, setMetrics] = useState(undefined)
  const [unlCount, setUnlCount] = useState(undefined)
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
        const newValidators = {}
        let newUnlCount = 0

        resp.data.forEach((v) => {
          newUnlCount += v.unl === process.env.REACT_APP_VALIDATOR ? 1 : 0
          newValidators[v.signing_key] = v
        })

        setValidators(newValidators)
        setUnlCount(newUnlCount)
      })
      .catch((e) => Log.error(e))
  }

  useEffect(() => {
    const interval = setInterval(fetchValidators, 5 * 60 * 1000)
    return function cleanup() {
      clearInterval(interval)
    }
  })

  const updateSelected = (pubkey) => {
    setSelected(selected === pubkey ? null : pubkey)
  }

  const updateLedgers = (newLedgers) => {
    setLedgers(newLedgers)
  }

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics)
  }

  const pause = () => setPaused(!paused)

  const { language } = i18n

  return (
    <div className="ledgers-page">
      <Streams
        validators={validators}
        updateLedgers={updateLedgers}
        updateMetrics={updateMetrics}
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

export default connect((state) => ({
  language: state.app.language,
}))(withTranslation()(LedgersPage))
