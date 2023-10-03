import { useContext } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import { useRouteParams } from '../shared/routing'
import { AMENDMENT_ROUTE } from '../App/routes'
import NetworkContext from '../shared/NetworkContext'
import {
  FETCH_INTERVAL_ERROR_MILLIS,
  FETCH_INTERVAL_VHS_MILLIS,
  localizeDate,
  NOT_FOUND,
  SERVER_ERROR,
} from '../shared/utils'
import { Simple } from './Simple'
import { AmendmentVote } from '../shared/vhsTypes'
import { useLanguage } from '../shared/hooks'
import Log from '../shared/log'
import { Votes } from './Votes'

import './amendment.scss'
import NoMatch from '../NoMatch'
import { useAnalytics } from '../shared/analytics'
import { Loader } from '../shared/components/Loader'

const DATE_OPTIONS_AMENDMEND = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
}

const DEFAULT_EMPTY_VALUE = '--'

export const Amendment = () => {
  const network = useContext(NetworkContext)
  const { identifier = '' } = useRouteParams(AMENDMENT_ROUTE)
  const { width } = useWindowSize()
  const { t } = useTranslation()
  const language = useLanguage()
  const { trackException } = useAnalytics()

  const ERROR_MESSAGES = {
    [NOT_FOUND]: {
      title: 'amendment_not_found',
      hints: ['check_amendment_key'],
    },
    default: {
      title: 'generic_error',
      hints: ['not_your_fault'],
    },
  }

  const getErrorMessage = (error: keyof typeof ERROR_MESSAGES | null) =>
    (error && ERROR_MESSAGES[error]) || ERROR_MESSAGES.default

  const { data, error, isLoading } = useQuery<
    AmendmentVote,
    keyof typeof ERROR_MESSAGES | null
  >(['fetchAmendmentData', identifier], async () => fetchAmendmentData(), {
    refetchInterval: (_) => FETCH_INTERVAL_VHS_MILLIS,
    refetchOnMount: true,
    enabled: !!network,
  })

  const { data: validators } = useQuery(
    ['fetchValidatorsData'],
    () => fetchValidatorsData(),
    {
      refetchInterval: (returnedData, _) =>
        returnedData == null
          ? FETCH_INTERVAL_ERROR_MILLIS
          : FETCH_INTERVAL_VHS_MILLIS,
      refetchOnMount: true,
      enabled: process.env.VITE_ENVIRONMENT !== 'custom' || !!network,
    },
  )

  const fetchAmendmentData = async (): Promise<AmendmentVote> => {
    const url = `${process.env.VITE_DATA_URL}/amendment/vote/${network}/${identifier}`
    return axios
      .get(url)
      .then((resp) => resp.data)
      .then((response) => {
        if (response.voting_status === 'voting') {
          return {
            voting_status: 'voting',
            amendment_id: response.amendment.id,
            name: response.amendment.name,
            rippled_version: response.amendment.rippled_version,
            deprecated: response.amendment.deprecated,
            consensus: response.amendment.consensus,
            threshold: response.amendment.threshold,
            voted: response.amendment.voted.validators,
          }
        }
        return {
          voting_status: 'enabled',
          amendment_id: response.amendment.id,
          name: response.amendment.name,
          rippled_version: response.amendment.rippled_version,
          deprecated: response.amendment.deprecated,
          tx_hash: response.amendment.tx_hash,
          date: response.amendment.date
            ? localizeDate(
                new Date(response.amendment.date),
                language,
                DATE_OPTIONS_AMENDMEND,
              )
            : DEFAULT_EMPTY_VALUE,
        }
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

  const fetchValidatorsData = () => {
    const url = `${process.env.VITE_DATA_URL}/validators/${network}`

    return axios
      .get(url)
      .then((resp) => resp.data.validators)
      .then((vals) =>
        vals.map((val) => ({
          pubkey: val.validation_public_key,
          signing_key: val.signing_key,
          domain: val.domain,
          unl: val.unl,
        })),
      )
      .catch((e) => Log.error(e))
  }

  let body

  if (error) {
    const message = getErrorMessage(error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data?.amendment_id) {
    body = (
      <>
        <div className="summary">
          <div className="type">{t('amendment_summary')}</div>
        </div>
        <div className="simple-body">
          {data && validators && (
            <Simple data={data} validators={validators} width={width} />
          )}
        </div>
        {data && validators && <Votes data={data} validators={validators} />}
      </>
    )
  }

  return (
    <div className="amendment-summary">
      {isLoading && <Loader />}
      {body}
    </div>
  )
}
