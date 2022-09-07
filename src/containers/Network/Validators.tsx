import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouteMatch } from 'react-router'
import NetworkTabs from './NetworkTab'
import Streams from '../shared/components/Streams'
import ValidatorsTable from './ValidatorsTable'
import Log from '../shared/log'
import { localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Hexagons from './Hexagons'

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [vList, setVList] = useState<any>([{}])
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)
  const { path = '/' } = useRouteMatch()

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchData = () => {
    const url = '/api/v1/validators?verbose=true'

    axios
      .get(url)
      .then((resp) => {
        const newValidatorList: any = {}
        resp.data.forEach((v: any) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => newValidatorList)
        setUnlCount(resp.data.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

  const updateValidators = (newValidations: any[]) => {
    // @ts-ignore
    setValidations(newValidations)
    setVList((value: any) => {
      const newValidatorsList: any = { ...value }
      newValidations.forEach((validation: any) => {
        newValidatorsList[validation.pubkey] = {
          ...value[validation.pubkey],
          ledger_index: validation.ledger_index,
          ledger_hash: validation.ledger_hash,
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
      {validatorCount && (
        // @ts-ignore
        <Hexagons data={validations} list={vList} />
      )}
      <div className="stat">
        {validatorCount && (
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
        )}
      </div>
      <div className="wrap">
        <NetworkTabs selected="validators" path={path} />
        <ValidatorsTable validators={vList} metrics={metrics} />
      </div>
    </div>
  )
}
