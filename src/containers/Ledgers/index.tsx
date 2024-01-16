import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import axios from 'axios'
import Log from '../shared/log'
import { FETCH_INTERVAL_ERROR_MILLIS } from '../shared/utils'
import Streams from '../shared/components/Streams'
import { LedgerMetrics } from './LedgerMetrics'
import { Ledgers } from './Ledgers'
import { Ledger, ValidatorResponse } from './types'
import { useAnalytics } from '../shared/analytics'
import NetworkContext from '../shared/NetworkContext'
import { useIsOnline } from '../shared/SocketContext'
import { TooltipProvider } from './useTooltip'
import { SelectedValidatorProvider } from './useSelectedValidator'

const FETCH_INTERVAL_MILLIS = 5 * 60 * 1000

const LedgersPage = () => {
  const { trackScreenLoaded } = useAnalytics()
  const [validators, setValidators] = useState<
    Record<string, ValidatorResponse>
  >({})
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const [paused, setPaused] = useState(false)
  const [metrics, setMetrics] = useState(undefined)
  const [unlCount, setUnlCount] = useState<number | undefined>(undefined)
  const { isOnline } = useIsOnline()
  const { t } = useTranslation()
  const network = useContext(NetworkContext)

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
      .then((validatorResponse) => {
        const newValidators: Record<string, ValidatorResponse> = {}
        let newUnlCount = 0

        validatorResponse.forEach((v: ValidatorResponse) => {
          if (v.unl === process.env.VITE_VALIDATOR) {
            newUnlCount += 1
          }
          newValidators[v.signing_key] = v
        })

        setValidators(newValidators)
        setUnlCount(newUnlCount)
        return true
      })
      .catch((e) => Log.error(e))
  }

  useQuery(['fetchValidatorData'], async () => fetchValidators(), {
    refetchInterval: (returnedData, _) =>
      returnedData == null
        ? FETCH_INTERVAL_ERROR_MILLIS
        : FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
    enabled: !!network,
  })

  const pause = () => setPaused(!paused)

  return (
    <div className="ledgers-page">
      <Helmet title={t('ledgers')} />
      {isOnline && (
        <Streams
          validators={validators}
          updateLedgers={setLedgers}
          updateMetrics={setMetrics}
        />
      )}
      <SelectedValidatorProvider>
        <TooltipProvider>
          <LedgerMetrics
            data={metrics}
            onPause={() => pause()}
            paused={paused}
          />
        </TooltipProvider>
        <TooltipProvider>
          <Ledgers
            ledgers={ledgers}
            validators={validators}
            unlCount={unlCount}
            paused={paused}
          />
        </TooltipProvider>
      </SelectedValidatorProvider>
    </div>
  )
}

export default LedgersPage
