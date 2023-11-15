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

const DATE_OPTIONS_AMENDMEND = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
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
      <div className="badge voting">{`${t('not')} ${t('enabled')}`}</div>
    ) : (
      <div className="badge enabled">{t('enabled')}</div>
    )

  const renderDate = (date: string | null) =>
    date
      ? localizeDate(new Date(date), language, DATE_OPTIONS_AMENDMEND)
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
        <SimpleRow label={t('eta')} className="eta">
          {t('voting')}
        </SimpleRow>
        <SimpleRow label={t('consensus')} className="badge consensus">
          {data.consensus}
        </SimpleRow>
      </>
    ) : data.tx_hash ? (
      <SimpleRow label={`${t('enabled')} (${t('on')})`.trim()}>
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
          {`v${data.rippled_version}`}
        </SimpleRow>
        {voting ? (
          <SimpleRow label={t('threshold')}>{data.threshold}</SimpleRow>
        ) : (
          data.tx_hash && (
            <SimpleRow label={t('tx')}>
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
          <Link to={details}>{details}</Link>
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
