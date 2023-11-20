import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

import { ValidatorSupplemented } from '../shared/vhsTypes'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  SERVER_ERROR,
  renderXRP,
} from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
import { XRP_BASE } from '../shared/transactionUtils'

import './votingTab.scss'
import { RouteLink } from '../shared/routing'
import { AMENDMENT_ROUTE } from '../App/routes'

export const VotingTab: FC<{
  validatorData: ValidatorSupplemented
  network: string | undefined
}> = ({ validatorData, network }) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()

  const votedAmendments = new Set(
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
      .then((resp) => resp.data.amendments)
      .then((amendments) =>
        amendments.filter((amendment) => amendment.voted !== undefined),
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
    <div className="rows">
      <SimpleRow label={t('amendment_name')} className="amendment-name">
        <RouteLink to={AMENDMENT_ROUTE} params={{ identifier: id }}>
          {name}
        </RouteLink>
      </SimpleRow>
      <SimpleRow label={t('amendment_id')} className="text-truncate">
        {id}
      </SimpleRow>
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
          <div>{renderXRP(validatorData.base_fee / XRP_BASE)}</div>
        </div>
        <div className="cell">
          <div className="label">{t('account_reserve')}</div>
          <div>{renderXRP(validatorData.reserve_base / XRP_BASE)}</div>
        </div>
        <div className="cell">
          <div className="label">{t('object_reserve')}</div>
          <div>{renderXRP(validatorData.reserve_inc / XRP_BASE)}</div>
        </div>
      </div>
      <div className="amendment-label">{t('amendments')}</div>
      <div className="voting-amendment">
        {data !== undefined && data.length > 0 ? (
          data.map((amendment) => {
            const voted = votedAmendments.has(amendment.id)
            return renderAmendment(amendment.id, amendment.name, voted)
          })
        ) : (
          <div className="no-match no-match-amendments">
            <div className="hint">{t('no_amendment_in_voting')}</div>
          </div>
        )}
      </div>
    </div>
  )
}
