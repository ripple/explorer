import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import LedgerMetrics from './LedgerMetrics'
import Ledgers from './Ledgers'
import { useAnalytics } from '../shared/analytics'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'
import { useStreams } from '../shared/useStreams'

const LedgersPage = () => {
  const { ledgers, metrics, validators, unlCount } = useStreams()
  const { trackScreenLoaded } = useAnalytics()
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const { isOnline } = useIsOnline()
  const { t } = useTranslation()
  const language = useLanguage()

  useEffect(() => {
    trackScreenLoaded()
    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

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
        unlCount={unlCount}
        selected={selected}
        setSelected={updateSelected}
        paused={paused}
        isOnline={isOnline}
      />
    </div>
  )
}

export default LedgersPage
