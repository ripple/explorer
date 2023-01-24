import { useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkTabs from './NetworkTabs'
import Streams from '../shared/components/Streams'
import ValidatorsTable from './ValidatorsTable'
import Log from '../shared/log'
import { localizeNumber, FETCH_INTERVAL_MILLIS } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Hexagons from './Hexagons'
import { StreamValidator, ValidatorResponse } from '../shared/vhsTypes'
import { getNetworkFromEnv } from '../shared/vhsUtils'

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [vList, setVList] = useState<Record<string, StreamValidator>>({})
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)

  useQuery(['fetchValidatorsData'], () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
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

  function fetchData(): void {
    const network = getNetworkFromEnv()
    const url = `${process.env.REACT_APP_DATA_URL}/validators/${network}`

    axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((validators) => {
        const newValidatorList: Record<string, ValidatorResponse> = {}
        validators.forEach((v: ValidatorResponse) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => mergeLatest(newValidatorList, vList))
        setUnlCount(validators.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  function updateValidators(newValidations: StreamValidator[]): void {
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
  return (
    <div className="network-page">
      <Streams
        validators={vList}
        updateValidators={updateValidators}
        updateMetrics={setMetrics}
      />

      {
        // @ts-ignore - Work around for complex type assignment issues
        <Hexagons data={validations} list={vList} />
      }
      <div className="stat">
        <>
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
        </>
      </div>
      <div className="wrap">
        <NetworkTabs selected="validators" />
        <ValidatorsTable validators={Object.values(vList)} metrics={metrics} />
      </div>
    </div>
  )
}
