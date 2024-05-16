/* eslint-disable no-nested-ternary -- Disabled for this file */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TRANSACTION_ROUTE } from '../App/routes'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import { useLanguage } from '../shared/hooks'
import { RouteLink } from '../shared/routing'
import { BREAKPOINTS, localizeDate } from '../shared/utils'
import { AmendmentData, Voter } from '../shared/vhsTypes'

interface validatorUNL {
  signing_key: string
  domain: string
  unl: string | false
}

interface SimpleProps {
  data: AmendmentData
  validators: Array<validatorUNL>
  width: number
}

const DATE_OPTIONS_AMENDMENT = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: 'UTC',
}

const DEFAULT_EMPTY_VALUE = '--'

export const Simple = ({ data, validators, width }: SimpleProps) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const voting = data.voted !== undefined

  const calculateUNLNays = (voted: Voter, all: Array<validatorUNL>): number =>
    all.filter((val) => val.unl !== false).length -
    voted.validators.filter((val) => val.unl !== false).length

  const renderStatus = () =>
    voting ? (
      <div className="badge voting" title="enabled">{`${t('not')} ${t(
        'enabled',
      )}`}</div>
    ) : (
      <div className="badge enabled" title="enabled">
        {t('enabled')}
      </div>
    )

  const renderDate = (date: string | null) =>
    date
      ? localizeDate(new Date(date), language, DATE_OPTIONS_AMENDMENT)
      : DEFAULT_EMPTY_VALUE

  const renderRowIndex = () =>
    voting ? (
      <>
        {data.voted !== undefined && (
          <>
            <SimpleRow label={`${t('yeas')} (${t('all')})`}>
              {data.voted.validators.length}
            </SimpleRow>
            <SimpleRow label={`${t('nays')} (${t('all')})`}>
              {validators.length - data.voted.validators.length}
            </SimpleRow>
            <SimpleRow label={`${t('yeas')} (${t('unl')})`}>
              {
                data.voted.validators.filter((voted) => voted.unl !== false)
                  .length
              }
            </SimpleRow>
            <SimpleRow label={`${t('nays')} (${t('unl')})`}>
              {calculateUNLNays(data.voted, validators)}
            </SimpleRow>
          </>
        )}
        {data.eta ? (
          <SimpleRow label={`${t('eta')} (UTC)`} className="eta yes">
            {localizeDate(new Date(data.eta), language, DATE_OPTIONS_AMENDMENT)}
          </SimpleRow>
        ) : (
          <SimpleRow label={t('eta')} className="eta no">
            {t('voting')}
          </SimpleRow>
        )}

        <SimpleRow label={t('consensus')} className="badge consensus">
          {data.consensus}
        </SimpleRow>
      </>
    ) : data.tx_hash ? (
      <SimpleRow label={`${t('enabled')} ${t('on')} (UTC)`.trim()}>
        <RouteLink to={TRANSACTION_ROUTE} params={{ identifier: data.tx_hash }}>
          {' '}
          {renderDate(data.date)}
        </RouteLink>
      </SimpleRow>
    ) : (
      <SimpleRow label={`${t('enabled')} (${t('on')})`.trim()}>
        {renderDate(data.date)}
      </SimpleRow>
    )

  const rowIndex = renderRowIndex()

  const details = `https://xrpl.org/known-amendments.html#${data.name.toLowerCase()}`

  return (
    <>
      <div className="rows">
        <SimpleRow label={t('name')}>{data.name}</SimpleRow>
        <SimpleRow label={t('amendment_id')}>{data.id}</SimpleRow>
        <SimpleRow label={t('introduced_in')}>
          {data.rippled_version ? (
            <Link
              to={`https://github.com/XRPLF/rippled/releases/tag/${data.rippled_version}`}
              target="_blank"
            >
              {`v${data.rippled_version}`}
            </Link>
          ) : (
            t('n_a')
          )}
        </SimpleRow>
        {voting ? (
          <SimpleRow label={t('threshold')}>{data.threshold}</SimpleRow>
        ) : (
          data.tx_hash && (
            <SimpleRow label={t('enable_tx')}>
              <RouteLink
                to={TRANSACTION_ROUTE}
                params={{ identifier: data.tx_hash }}
              >
                {' '}
                {data.tx_hash}
              </RouteLink>
            </SimpleRow>
          )
        )}
        <SimpleRow label={t('details')}>
          <Link to={details} target="_blank">
            {details}
          </Link>
        </SimpleRow>
        <SimpleRow label={t('status')}>{renderStatus()}</SimpleRow>
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
    </>
  )
}
