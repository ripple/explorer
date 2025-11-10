import './css/style.scss'

import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { getServerState } from '../../rippled/lib/rippled'
import { ValidatorsTable } from './ValidatorsTable'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_FEE_SETTINGS_MILLIS,
  localizeNumber,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import { Hexagons } from './Hexagons'
import { FeeSettings, StreamValidator } from '../shared/vhsTypes'
import { VALIDATORS_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import ValidatorsTabs from './ValidatorsTabs'
import { useStreams, StreamsProvider } from '../shared/components/Streams'
import {
  VHSValidatorsProvider,
  useVHSValidators,
} from '../shared/components/VHSValidators'
import SocketContext from '../shared/SocketContext'
import NetworkContext from '../shared/NetworkContext'

export const ValidatorsData = () => {
  const rippledSocket = useContext(SocketContext)
  const network = useContext(NetworkContext)

  const language = useLanguage()
  const { t } = useTranslation()
  const { validators: validatorsFromValidations, metrics } = useStreams()
  const { validators: validatorsFromVHS, unl } = useVHSValidators()
  const [feeSettings, setFeeSettings] = useState<FeeSettings>()

  const merged = useMemo(() => {
    if (
      !validatorsFromVHS ||
      !(
        validatorsFromValidations &&
        Object.keys(validatorsFromValidations).length
      )
    ) {
      return []
    }

    const updated: Record<string, StreamValidator> = {}
    const keys = new Set(
      Object.keys(validatorsFromVHS).concat(
        Object.keys(validatorsFromValidations),
      ),
    )
    keys.forEach((d: string) => {
      const newData: StreamValidator =
        validatorsFromVHS[d] || validatorsFromValidations[d]
      if (
        newData.ledger_index == null &&
        validatorsFromValidations[d] &&
        validatorsFromValidations[d].ledger_index
      ) {
        // VHS uses `current_index` instead of `ledger_index`
        // If `ledger_index` isn't defined, then we're still using the VHS data,
        // instead of the Streams data
        newData.ledger_index = validatorsFromValidations[d].ledger_index
      }
      if (newData.current_index == null) {
        newData.signing_key = validatorsFromValidations[d].signing_key
      }
      // latest hash and time comes from the validations stream
      if (validatorsFromValidations[d]) {
        newData.time = validatorsFromValidations[d].time
        newData.ledger_hash = validatorsFromValidations[d].ledger_hash
      }

      updated[d] = newData
    })

    return Object.values(updated)
  }, [validatorsFromVHS, validatorsFromValidations])

  const validatorCount = useMemo(
    () => merged && Object.keys(merged).length,
    [merged],
  )

  const { tab = 'uptime' } = useRouteParams(VALIDATORS_ROUTE)

  useQuery(['fetchFeeSettingsData'], () => fetchFeeSettingsData(), {
    refetchInterval: (returnedData, _) =>
      returnedData == null
        ? FETCH_INTERVAL_ERROR_MILLIS
        : FETCH_INTERVAL_FEE_SETTINGS_MILLIS,
    refetchOnMount: true,
    enabled:
      (process.env.VITE_ENVIRONMENT !== 'custom' || !!network) &&
      tab === 'voting',
  })

  function fetchFeeSettingsData() {
    getServerState(rippledSocket).then((res) => {
      setFeeSettings({
        base_fee: res.state.validated_ledger.base_fee,
        reserve_base: res.state.validated_ledger.reserve_base,
        reserve_inc: res.state.validated_ledger.reserve_inc,
      })
    })
  }

  const Body = {
    uptime: (
      <ValidatorsTable validators={merged} metrics={metrics} tab="uptime" />
    ),
    voting: (
      <ValidatorsTable
        validators={merged}
        metrics={metrics}
        tab="voting"
        feeSettings={feeSettings}
      />
    ),
  }[tab]
  return (
    <div className="network-page">
      <div className="type">{t('validators')}</div>
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Hexagons data={validatorsFromValidations} list={validatorsFromVHS} />
      }
      <div className="stat">
        <span>{t('validators_found')}: </span>
        <span>
          {localizeNumber(validatorCount, language)}
          {unl?.length !== 0 && (
            <i>
              {' '}
              ({t('unl')}: {unl?.length})
            </i>
          )}
        </span>
      </div>
      <div className="wrap">
        <ValidatorsTabs selected={tab} />
        <Helmet title={t('validators')} />
        {Body}
      </div>
    </div>
  )
}

export const Validators = () => (
  <StreamsProvider>
    <VHSValidatorsProvider>
      <ValidatorsData />
    </VHSValidatorsProvider>
  </StreamsProvider>
)
