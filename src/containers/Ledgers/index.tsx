import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import axios from 'axios'
import Log from '../shared/log'
import LedgerMetrics from './LedgerMetrics'
import Ledgers from './Ledgers'
import { ValidatorResponse } from './types'
import { useAnalytics } from '../shared/analytics'
import NetworkContext from '../shared/NetworkContext'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'
import { useStreams } from '../shared/useStreams'

const FETCH_INTERVAL_MILLIS = 5 * 60 * 1000

const LedgersPage = () => {
  const { ledgers, metrics, validators } = useStreams()
  const { trackScreenLoaded } = useAnalytics()
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const { isOnline } = useIsOnline()
  const { t } = useTranslation()
  const network = useContext(NetworkContext)
  const language = useLanguage()

  useEffect(() => {
    trackScreenLoaded()
    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

  const fetchValidators = () => {
    const url = `${process.env.VITE_DATA_URL}/validators/${network}`

    return axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((data) => {
        const newValidators: Record<string, ValidatorResponse> = {}
        let newUnlCount = 0

        data.forEach((v: ValidatorResponse) => {
          if (v.unl === process.env.VITE_VALIDATOR) {
            newUnlCount += 1
          }
          newValidators[v.signing_key] = v
        })

        return {
          validators: data,
          unlCount: newUnlCount,
        }
      })
      .catch((e) => Log.error(e))
  }

  const { data: validationData } = useQuery<{
    validators: ValidatorResponse[]
    unlCount: number
  }>(['fetchValidatorData'], async () => fetchValidators(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
    placeholderData: { validators: [], unlCount: 0 },
  })

  const updateSelected = (pubkey: string) => {
    setSelected(selected === pubkey ? null : pubkey)
  }

  const pause = () => setPaused(!paused)

  return (
    <div className="ledgers-page">
      <Helmet title={t('ledgers')} />
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
        vhsData={validationData?.validators ?? []}
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
