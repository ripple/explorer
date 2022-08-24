import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import NetworkTabs from './NetworkTab'
=======
import { useRouteMatch } from 'react-router'
import Tabs from '../shared/components/Tabs'
>>>>>>> 1488579 (refractor validators)
import Streams from '../shared/components/Streams'
import ValidatorsTable from './ValidatorsTable'
import Log from '../shared/log'
import { localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import Hexagons from './Hexagons'

<<<<<<< HEAD
export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [vList, setVList] = useState<any>([{}])
  const [validations, setValidations] = useState([])
  const [metrics, setMetrics] = useState({})
  const [unlCount, setUnlCount] = useState(0)

=======
const mergeLatest = (validators: any[] = [], live: any[] = []) => {
  const latest: any = {}
  live.forEach((d) => {
    latest[d.pubkey] = {
      ledger_index: d.ledger_index,
      ledger_hash: d.ledger_hash,
    }
  })

  return validators.map((d) => {
    const updated: any = {}
    if (
      latest[d.signing_key] &&
      latest[d.signing_key].ledger_index > d.ledger_index
    ) {
      updated.ledger_index = latest[d.signing_key].ledger_index
      updated.ledger_hash = latest[d.signing_key].ledger_hash
    }

    return Object.assign(d, updated)
  })
}
export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()

  const [vList, setVList] = useState({})
  const [liveValidators, setLiveValidators] = useState([])
  const [metrics, setMetrics] = useState({})
  const [validators, setValidators] = useState([])
  const [unlCount, setUnlCount] = useState(0)
  const { path = '/' } = useRouteMatch()

  liveValidators.slice(0, 1)
>>>>>>> 1488579 (refractor validators)
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
<<<<<<< HEAD
        const newValidatorList: any = {}
        resp.data.forEach((v: any) => {
          newValidatorList[v.signing_key] = v
        })

        setVList(() => newValidatorList)
=======
        const newVList: any = {}
        resp.data.forEach((v: any) => {
          newVList[v.signing_key] = {
            signing_key: v.signing_key,
            master_key: v.master_key,
            unl: v.unl,
            domain: v.domain,
          }
        })

        setVList(newVList)
        // @ts-ignore
        setValidators((prevValidators: any[]) =>
          mergeLatest(resp.data, prevValidators),
        )
>>>>>>> 1488579 (refractor validators)
        setUnlCount(resp.data.filter((d: any) => Boolean(d.unl)).length)
      })
      .catch((e) => Log.error(e))
  }

<<<<<<< HEAD
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
=======
  const updateValidators = (newValidators: any[]) => {
    // @ts-ignore
    setLiveValidators(newValidators)
    // @ts-ignore
    setValidators((prevValidators: any[]) =>
      mergeLatest(prevValidators, newValidators),
    )
  }

  const tabs = ['nodes', 'validators', 'chart']
  // @ts-ignore

>>>>>>> 1488579 (refractor validators)
  return (
    <div className="network-page">
      <Streams
        validators={vList}
        updateValidators={updateValidators}
        updateMetrics={setMetrics}
      />
<<<<<<< HEAD
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
=======
      {
        // @ts-ignore
        validators.length && <Hexagons data={liveValidators} list={vList} />
      }
      <div className="stat">
        {validators && (
          <>
            <span>{t('validators_found')}: </span>
            <span>
              {localizeNumber(validators.length, language)}
>>>>>>> 1488579 (refractor validators)
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
<<<<<<< HEAD
        <NetworkTabs selected="validators" />
        <ValidatorsTable validators={vList} metrics={metrics} />
=======
        <Tabs tabs={tabs} selected="validators" path={path} />
        <ValidatorsTable validators={validators} metrics={metrics} />
>>>>>>> 1488579 (refractor validators)
      </div>
    </div>
  )
}
