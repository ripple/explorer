import axios from 'axios'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkContext from '../shared/NetworkContext'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
} from '../shared/utils'
import { AmendmentsList } from '../shared/vhsTypes'

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
      .then((response) => {
        const res: AmendmentsList[] = []
        for (const enabled of response.enabled.amendments) {
          res.push({
            version: enabled.rippled_version,
            id: enabled.id,
            name: enabled.name,
            voters: null,
            threshold: null,
            consensus: null,
            enabled: true,
            deprecated: enabled.deprecated,
            on_tx: enabled.date,
          })
        }

        for (const voting of response.voting.amendments) {
          res.push({
            version: voting.rippled_version,
            id: voting.id,
            name: voting.name,
            voters: voting.voted.validators.filter((val) => val.unl === true)
              .length,
            threshold: voting.threshold,
            consensus: voting.consensus,
            enabled: true,
            deprecated: voting.deprecated,
            on_tx: t('voting'),
          })
        }
        return res
      })
}
