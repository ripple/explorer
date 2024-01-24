import { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkTabs from './NetworkTabs'
import ValidatorsTable from './ValidatorsTable'
import Log from '../shared/log'
import {
  localizeNumber,
  FETCH_INTERVAL_MILLIS,
  FETCH_INTERVAL_ERROR_MILLIS,
} from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import { Hexagons } from './Hexagons'
import { StreamValidator, ValidatorResponse } from '../shared/vhsTypes'
import NetworkContext from '../shared/NetworkContext'
import { TooltipProvider } from '../shared/components/Tooltip'
import { useStreams } from '../shared/components/Streams/StreamsContext'

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { validators: validatorsFromValidations, metrics } = useStreams()
  const [unlCount, setUnlCount] = useState(0)
  const network = useContext(NetworkContext)

  const { data: validatorsFromVHS } = useQuery(
    ['fetchValidatorsData'],
    () => fetchData(),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_MILLIS,
      refetchOnMount: true,
      enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
    },
  )

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

        setUnlCount(validators.filter((d: any) => Boolean(d.unl)).length)
        return newValidatorList
      })
      .catch((e) => Log.error(e))
  }

  const merged = useMemo(() => {
    if (
      !validatorsFromVHS ||
      !(
        validatorsFromValidations &&
        Object.keys(validatorsFromValidations).length
      )
    ) {
      return
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
        newData.signing_key = validatorsFromValidations[d].pubkey
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

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <TooltipProvider>
          <Hexagons data={validatorsFromValidations} list={validatorsFromVHS} />
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
        <NetworkTabs selected="validators" />
        <ValidatorsTable validators={merged} metrics={metrics} />
      </div>
    </div>
  )
}
