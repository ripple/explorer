import { useContext } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useRouteParams } from '../shared/routing'
import { AMENDMENT_ROUTE } from '../App/routes'
import NetworkContext from '../shared/NetworkContext'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  SERVER_ERROR,
} from '../shared/utils'

export const Amendment = () => {
  const network = useContext(NetworkContext)
  const { identifier = '' } = useRouteParams(AMENDMENT_ROUTE)
  const { t } = useTranslation()

  const { data } = useQuery(
    ['fetchNetworkAmendmentData'],
    async () => fetchAmendmentData(),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
      enabled: !!network,
    },
  )

  const fetchAmendmentData = async () => {
    const url = `${process.env.VITE_DATA_URL}/amendment/vote/${network}/${identifier}`
    console.log(url)
    axios
      .get(url)
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .catch((axiosError) => {
        const status =
          axiosError.response && axiosError.response.status
            ? axiosError.response.status
            : SERVER_ERROR
        trackException(`${url} --- ${JSON.stringify(axiosError)}`)
        return Promise.reject(status)
      })
  }

  console.log(data)
  return (
    <h1>
      <span>{t('token')}</span>
      {data && <span>{data.status}</span>}
    </h1>
  )
}
function trackException(arg0: string) {
  throw new Error('Function not implemented.')
}
