import { FC, useContext } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { VHSValidatorsContext } from './VHSValidatorsContext'
import { FETCH_INTERVAL_ERROR_MILLIS, FETCH_INTERVAL_MILLIS } from '../../utils'
import { ValidatorResponse } from '../../vhsTypes'
import Log from '../../log'
import NetworkContext from '../../NetworkContext'
import { VHSValidatorsHookResult } from './types'

export const VHSValidatorsProvider: FC = ({ children }) => {
  const network = useContext(NetworkContext)

  const { data: value } = useQuery<VHSValidatorsHookResult>(
    ['fetchValidatorsData'],
    () => fetchVHSData(),
    {
      refetchInterval: 0,
      refetchOnMount: true,
      enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
      initialData: {
        unl: undefined,
        validators: undefined,
      },
    },
  )

  function fetchVHSData(): Promise<VHSValidatorsHookResult> {
    const url = `${process.env.VITE_DATA_URL}/validators/${network}`

    return axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((validators) => {
        const newValidatorList: Record<string, ValidatorResponse> = {}
        validators.forEach((v: ValidatorResponse) => {
          newValidatorList[v.signing_key] = v
        })

        return {
          validators: newValidatorList,
          unl: validators
            .filter((d: ValidatorResponse) => Boolean(d.unl))
            .map((d: ValidatorResponse) => d.signing_key),
        }
      })
      .catch((e) => {
        Log.error(e)

        return {
          unl: undefined,
          validators: undefined,
        }
      })
  }

  return (
    <VHSValidatorsContext.Provider value={value}>
      {children}
    </VHSValidatorsContext.Provider>
  )
}
