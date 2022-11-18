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

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [extras, setExtras] = useState<Set<string>>(new Set())
  const [vList, setVList] = useState<any>([])
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)

  useQuery(['fetchValidatorsData'], () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_MILLIS,
    refetchOnMount: true,
  })

  const fetchData = () => {
    const url = '/api/v1/validators?verbose=true'

    axios
      .get(url)
      .then((resp) => {
        const newValidatorList: any = {}
        resp.data.forEach((v: any) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => {
          const newVList: any = {}
          Object.keys(newValidatorList).forEach((key: string) => {
            newVList[key] = newValidatorList[key]
          })
          // Add back the empty validators, remove from extras if VHS refelected
          Array.from(extras).forEach((key: string) => {
            if (newVList[key] === undefined) {
              newVList[key] = vList[key]
            } else {
              setExtras(() => {
                extras.delete(key)
                return extras
              })
            }
          })
          return newVList
        })
        setUnlCount(resp.data.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidations: any[]) => {
    // @ts-ignore - Work around type assignment for complex validation data types
    setValidations(newValidations)
    setVList((value: any) => {
      const newValidatorsList: any = { ...value }
      newValidations.forEach((validation: any) => {
        if (value[validation.pubkey] === undefined) {
          setExtras(() => {
            extras.add(validation.pubkey)
            return extras
          })

          newValidatorsList[validation.pubkey] = {
            signing_key: validation.pubkey,
          }
        } else {
          newValidatorsList[validation.pubkey] = {
            ...value[validation.pubkey],
          }
        }
        newValidatorsList[validation.pubkey].ledger_index =
          validation.ledger_index
        newValidatorsList[validation.pubkey].ledger_hash =
          validation.ledger_hash
      })
      // Remove the empty ones if they are not reflected in current stream.
      Array.from(extras).forEach((key) => {
        if (newValidatorsList[key] === undefined) {
          setExtras(() => {
            extras.delete(key)
            return extras
          })
        }
      })
      return newValidatorsList
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
        <ValidatorsTable validators={vList} metrics={metrics} />
      </div>
    </div>
  )
}
