import { useContext, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import Streams from '../shared/components/Streams'
import { ValidatorsTable } from './ValidatorsTable'
import Log from '../shared/log'
import {
  localizeNumber,
  FETCH_INTERVAL_MILLIS,
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_FEE_SETTINGS_MILLIS,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import { Hexagons } from './Hexagons'
import {
  FeeSettings,
  StreamValidator,
  ValidatorResponse,
} from '../shared/vhsTypes'
import NetworkContext from '../shared/NetworkContext'
import { TooltipProvider } from '../shared/components/Tooltip'
import './css/style.scss'
import { VALIDATORS_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import ValidatorsTabs from './ValidatorsTabs'
import SocketContext from '../shared/SocketContext'
import { getServerState } from '../../rippled/lib/rippled'

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [vList, setVList] = useState<Record<string, StreamValidator>>({})
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)
  const [feeSettings, setFeeSettings] = useState<FeeSettings | undefined>(
    undefined,
  )
  const network = useContext(NetworkContext)
  const rippledSocket = useContext(SocketContext)
  const { tab = 'uptime' } = useRouteParams(VALIDATORS_ROUTE)

  useQuery(['fetchValidatorsData'], () => fetchData(), {
    refetchInterval: (returnedData, _) =>
      returnedData == null
        ? FETCH_INTERVAL_ERROR_MILLIS
        : FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
    enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
  })

  useQuery(['fetchFeeSettingsData'], () => fetchFeeSettingsData(), {
    refetchInterval: (returnedData, _) =>
      returnedData == null
        ? FETCH_INTERVAL_ERROR_MILLIS
        : FETCH_INTERVAL_FEE_SETTINGS_MILLIS,
    refetchOnMount: true,
    enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
  })

  function mergeLatest(
    validators: Record<string, ValidatorResponse>,
    live: Record<string, StreamValidator>,
  ): Record<string, StreamValidator> {
    const updated: Record<string, StreamValidator> = {}
    const keys = new Set(Object.keys(validators).concat(Object.keys(live)))
    keys.forEach((d: string) => {
      const newData: StreamValidator = validators[d] || live[d]
      if (newData.ledger_index == null && live[d] && live[d].ledger_index) {
        // VHS uses `current_index` instead of `ledger_index`
        // If `ledger_index` isn't defined, then we're still using the VHS data,
        // instead of the Streams data
        newData.ledger_index = live[d].ledger_index
        newData.ledger_hash = live[d].ledger_hash
      }
      updated[d] = newData
    })
    return updated
  }

  function fetchFeeSettingsData() {
    if (tab === 'voting') {
      getServerState(rippledSocket)
        .then((res) => res.state)
        .then((state) => {
          setFeeSettings({
            base_fee: state.validated_ledger.base_fee,
            reserve_base: state.validated_ledger.reserve_base,
            reserve_inc: state.validated_ledger.reserve_inc,
          })
        })
    }
  }

  function fetchData() {
    const url = `${process.env.VITE_DATA_URL}/validators/${network}`

    return axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((validators) => {
        const newValidatorList: Record<string, ValidatorResponse> = {}
        validators.forEach((v: ValidatorResponse) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => mergeLatest(newValidatorList, vList))
        setUnlCount(validators.filter((d: any) => Boolean(d.unl)).length)
        return true // indicating success in getting the data
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidations: StreamValidator[]) => {
    // @ts-ignore - Work around type assignment for complex validation data types
    setValidations(newValidations)
    setVList((value) => {
      const newValidatorsList: Record<string, StreamValidator> = { ...value }
      newValidations.forEach((validation: any) => {
        newValidatorsList[validation.pubkey] = {
          ...value[validation.pubkey],
          signing_key: validation.pubkey,
          ledger_index: validation.ledger_index,
          ledger_hash: validation.ledger_hash,
        }
      })
      return mergeLatest(newValidatorsList, value)
    })
  }

  const validatorCount = Object.keys(vList).length

  const Body = {
    uptime: (
      <ValidatorsTable
        validators={Object.values(vList)}
        metrics={metrics}
        tab="uptime"
      />
    ),
    voting: (
      <ValidatorsTable
        validators={Object.values(vList)}
        metrics={metrics}
        tab="voting"
        feeSettings={feeSettings}
      />
    ),
  }[tab]
  return (
    <div className="network-page">
      <div className="type">{t('validators')}</div>
      {network && (
        <Streams
          validators={vList}
          updateValidators={updateValidators}
          updateMetrics={setMetrics}
        />
      )}
      {
        // @ts-ignore - Work around for complex type assignment issues
        <TooltipProvider>
          <Hexagons data={validations} list={vList} />
        </TooltipProvider>
      }
      <div className="stat">
        <span>{t('validators_found')}: </span>
        <span>
          {localizeNumber(validatorCount, language)}
          {unlCount !== 0 && (
            <i>
              {' '}
              ({t('unl')}: {unlCount})
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
