import axios from 'axios'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLanguage } from '../shared/hooks'
import NetworkContext from '../shared/NetworkContext'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  localizeDate,
} from '../shared/utils'
import { AmendmentsList } from '../shared/vhsTypes'
import { AmendmentsTable } from './AmendmentsTable'
import './amendmentsTable.scss'

const DATE_OPTIONS_AMENDMENDS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
}

const DEFAULT_EMPTY_VALUE = '--'

export const Amendments = () => {
  const network = useContext(NetworkContext)
  const { t } = useTranslation()
  const language = useLanguage()

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

        for (const voting of response.voting.amendments) {
          res.push({
            version: voting.rippled_version,
            id: voting.id,
            name: voting.name,
            voters: voting.voted.validators.filter((val) => val.unl !== false)
              .length,
            threshold: voting.threshold,
            consensus: voting.consensus,
            enabled: false,
            deprecated: voting.deprecated,
            on_tx: 'voting',
          })
        }

        for (const enabled of response.enabled.amendments) {
          res.push({
            version: enabled.rippled_version,
            id: enabled.id,
            name: enabled.name,
            // These fields are not as important when the amendments are enabled.
            voters: DEFAULT_EMPTY_VALUE,
            threshold: DEFAULT_EMPTY_VALUE,
            consensus: DEFAULT_EMPTY_VALUE,
            enabled: true,
            deprecated: enabled.deprecated,
            on_tx: enabled.date
              ? localizeDate(
                  new Date(enabled.date),
                  language,
                  DATE_OPTIONS_AMENDMENDS,
                )
              : DEFAULT_EMPTY_VALUE,
            tx_hash: enabled.tx_hash,
          })
        }
        return res
      })

  return (
    <div className="amendments-page">
      <div className="wrap">
        <div className="summary">
          <div className="type">{t('amendments')}</div>
        </div>
        <AmendmentsTable amendments={data} />
      </div>
    </div>
  )
}
