import React, { useState } from 'react'
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

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
}

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [vList, setVList] = useState<any>({})
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)

  useQuery(['fetchValidatorsData'], () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
  })

  const mergeLatest = (validators: any = {}, live: any = {}) => {
    const updated: any = {}
    const keys = new Set(Object.keys(validators).concat(Object.keys(live)))
    keys.forEach((d: string) => {
      updated[d] = validators[d] || live[d]
      if (updated[d].ledger_index == null && live[d] && live[d].ledger_index) {
        // VHS uses `current_index` instead of `ledger_index`
        // If `ledger_index` isn't defined, then we're still using the VHS data,
        // instead of the Streams data
        updated[d].ledger_index = live[d].ledger_index
        updated[d].ledger_hash = live[d].ledger_hash
      }
    })
    return updated
  }

  const fetchData = () => {
    const network = ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT as string]
    const url = `${process.env.REACT_APP_DATA_URL}/validators/${network}`

    axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((validators) => {
        const newValidatorList: any = {}
        validators.forEach((v: any) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => mergeLatest(newValidatorList, vList))
        setUnlCount(validators.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidations: any[]) => {
    // @ts-ignore - Work around type assignment for complex validation data types
    setValidations(newValidations)
    setVList((value: any) => {
      const newValidatorsList: any = { ...value }
      newValidations.forEach((validation: any) => {
        newValidatorsList[validation.pubkey] = {
          ...value[validation.pubkey],
          signing_key: validation.pubkey,
          ledger_index: validation.ledger_index,
          ledger_hash: validation.ledger_hash,
        }
      })
      return mergeLatest(newValidatorsList, vList)
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
