import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

import { ValidatorSupplemented } from '../shared/vhsTypes'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'

import './votingTab.scss'
import { renderXRP } from '../Ledgers/LedgerMetrics'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  SERVER_ERROR,
} from '../shared/utils'
import { useAnalytics } from '../shared/analytics'

const DROPS_TO_XRP_FACTOR = 1000000

export const VotingTab: FC<{
  validatorData: ValidatorSupplemented
  network: string | undefined
}> = ({ validatorData, network }) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()

  const votedAmenments = new Set(
    validatorData.amendments
      ? validatorData.amendments.map((amendment) => amendment.id)
      : [],
  )
  const { data } = useQuery<Array<{ id: string; name: string }>>(
    ['fetchNetworkVotingData', network],
    async () => fetchNetworkVote(network),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
      enabled: !!network,
    },
  )

  function fetchNetworkVote(networkID: string | undefined) {
    const url = `${process.env.VITE_DATA_URL}/amendments/vote/${networkID}`
    return axios
      .get(url)
      .then((resp) => resp.data)
      .then((response) =>
        response.amendments.voting.amendments.map((amendment) => ({
          id: amendment.id,
          name: amendment.name,
        })),
      )
      .catch((axiosError) => {
        const status =
          axiosError.response && axiosError.response.status
            ? axiosError.response.status
            : SERVER_ERROR
        trackException(`${url} --- ${JSON.stringify(axiosError)}`)
        return Promise.reject(status)
      })
  }

  const renderAmendment = (id: string, name: string, voted: boolean) => (
    <div className="row-amendment">
      <SimpleRow label={t('amendment_name')} className="amendment-name">
        {name}
      </SimpleRow>
      <SimpleRow label={t('amendment_id')}>{id}</SimpleRow>
      {voted ? (
        <SimpleRow label={t('vote')} className="badge yea">
          Yea
        </SimpleRow>
      ) : (
        <SimpleRow label={t('vote')} className="badge nay">
          Nay
        </SimpleRow>
      )}
    </div>
  )

  return (
    <div className="voting">
      <div className="metrics metrics-voting">
        <div className="cell">
          <div className="label">{t('base_fee')}</div>
          <div>{renderXRP(validatorData.base_fee / DROPS_TO_XRP_FACTOR)}</div>
        </div>
        <div className="cell">
          <div className="label">{t('reserve_base')}</div>
          <div>
            {renderXRP(validatorData.reserve_base / DROPS_TO_XRP_FACTOR)}
          </div>
        </div>
        <div className="cell">
          <div className="label">{t('reserve_inc')}</div>
          <div>
            {renderXRP(validatorData.reserve_inc / DROPS_TO_XRP_FACTOR)}
          </div>
        </div>
      </div>
      <div className="amendment-label">Amendments</div>
      <div className="voting-amendment">
        <div className="rows">
          {data !== undefined && data.length > 0 ? (
            data.map((amendment) => {
              let voted = false
              if (votedAmenments.has(amendment.id)) {
                voted = true
              }
              return renderAmendment(amendment.id, amendment.name, voted)
            })
          ) : (
            <div className="no-match no-match-amendments">
              <div className="hint">{t('no_amendment_in_voting')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
