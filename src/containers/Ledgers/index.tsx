import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import axios from 'axios'
import Log from '../shared/log'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import LedgerMetrics from './LedgerMetrics'
import Ledgers from './Ledgers'
import { ValidatorResponse } from './types'
import NetworkContext from '../shared/NetworkContext'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'
import { useStreams } from '../shared/useStreams'

const FETCH_INTERVAL_MILLIS = 5 * 60 * 1000

const LedgersPage = () => {
  const { ledgers } = useStreams()
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [metrics] = useState(undefined)
  const { isOnline } = useIsOnline()
  const { t } = useTranslation()
  const network = useContext(NetworkContext)
  const language = useLanguage()

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${t('ledgers')}`
    analytics(ANALYTIC_TYPES.pageview, { title: 'Ledgers', path: '/' })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [])

  const fetchValidators = () => {
    const url = `${process.env.VITE_DATA_URL}/validators/${network}`

    return axios
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

        return {
          validators: newValidators,
          unlCount: newUnlCount,
        }
      })
      .catch((e) => Log.error(e))
  }

  const { data: validationData } = useQuery<{
    validators: Record<string, any>
    unlCount: number
  }>(['fetchValidatorData'], async () => fetchValidators(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
    placeholderData: { validators: {}, unlCount: 0 },
  })

  const updateSelected = (pubkey: string) => {
    setSelected(selected === pubkey ? null : pubkey)
  }

  const pause = () => setPaused(!paused)

  return (
    <div className="ledgers-page">
      <LedgerMetrics
        language={language}
        data={metrics}
        onPause={() => pause()}
        paused={paused}
      />
      <Ledgers
        language={language}
        ledgers={ledgers}
        validators={validationData?.validators}
        unlCount={validationData?.unlCount}
        selected={selected}
        setSelected={updateSelected}
        paused={paused}
        isOnline={isOnline}
      />
    </div>
  )
}

export default LedgersPage
