import axios from 'axios'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import Log from '../shared/log'
import NetworkContext from '../shared/NetworkContext'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
} from '../shared/utils'
import { AmendmentsTable } from './AmendmentsTable'
import './amendmentsTable.scss'

export const Amendments = () => {
  const network = useContext(NetworkContext)
  const { t } = useTranslation()

  const { data } = useQuery(
    ['fetchNetworkAmendmentsData'],
    async () => fetchData(),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
      enabled: !!network,
    },
  )

  const fetchData = async () =>
    axios
      .get(`${process.env.VITE_DATA_URL}/amendments/vote/${network}`)
      .then((resp) => resp.data.amendments)
      .then((amendments) =>
        amendments.sort((a, b) => {
          if (a.eta && !b.eta) return -1
          if (!a.eta && b.eta) return 1
          if (a.voted && !b.voted) return -1
          if (!a.voted && b.voted) return 1
          return 0
        }),
      )
      .catch((e) => Log.error(e))

  return (
    <div className="amendments-page">
      <div className="wrap">
        <div className="summary" title="summary">
          <div className="type">{t('amendments')}</div>
        </div>
        <AmendmentsTable amendments={data} />
      </div>
    </div>
  )
}
