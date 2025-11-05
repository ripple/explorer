import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { LedgerMetrics } from './LedgerMetrics'
import { Ledgers } from './Ledgers'
import { LedgerCountdownBanner } from './LedgerCountdownBanner'
import { useAnalytics } from '../shared/analytics'
import { SelectedValidatorProvider } from './useSelectedValidator'
import { StreamsProvider, useStreams } from '../shared/components/Streams'
import { VHSValidatorsProvider } from '../shared/components/VHSValidators'

export const LedgersPage = () => {
  const { trackScreenLoaded } = useAnalytics()
  const [paused, setPaused] = useState(false)
  const [currentLedgerIndex, setCurrentLedgerIndex] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    trackScreenLoaded()
    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

  const pause = () => setPaused(!paused)
  const { t } = useTranslation()
  const { ledgers } = useStreams()

  // Extract current ledger index from the ledgers record
  useEffect(() => {
    const keys = Object.keys(ledgers)
    if (keys.length > 0) {
      const maxLedger = Math.max(...keys.map((k) => Number(k)))
      setCurrentLedgerIndex(maxLedger)
    }
  }, [ledgers])

  return (
    <div className="ledgers-page">
      <Helmet title={t('ledgers')} />
      <StreamsProvider>
        <VHSValidatorsProvider>
          <SelectedValidatorProvider>
              <LedgerCountdownBanner currentLedger={currentLedgerIndex} />
              <LedgerMetrics onPause={() => pause()} paused={paused} />
              <Ledgers paused={paused} />
          </SelectedValidatorProvider>
        </VHSValidatorsProvider>
      </StreamsProvider>
    </div>
  )
}
