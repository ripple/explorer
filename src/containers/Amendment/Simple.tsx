/* eslint-disable no-nested-ternary -- Disabled for this file */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TRANSACTION_ROUTE } from '../App/routes'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import { RouteLink } from '../shared/routing'
import { BREAKPOINTS } from '../shared/utils'
import { AmendmentVote, VotedValidators } from '../shared/vhsTypes'

interface validatorUNL {
  signing_key: string
  domain: string
  unl: string | false
}

interface SimpleProps {
  data: AmendmentVote
  validators: Array<validatorUNL>
  width: number
}

export const Simple = ({ data, validators, width }: SimpleProps) => {
  const { t } = useTranslation()

  const calculateUNLNays = (
    voted: Array<VotedValidators>,
    all: Array<validatorUNL>,
  ): number =>
    all.filter((val) => val.unl !== false).length -
    voted.filter((val) => val.unl !== false).length

  const renderStatus = (status: string) =>
    status === 'voting' ? (
      <div className="badge voting">{t('not_enabled')}</div>
    ) : (
      <div className="badge enabled">{t('enabled')}</div>
    )

  const renderRowIndex = () =>
    data.voting_status === 'voting' ? (
      <>
        {data.voted !== undefined && (
          <>
            <SimpleRow label={t('yeas_all')}>{data.voted.length}</SimpleRow>
            <SimpleRow label={t('nays_all')}>
              {validators.length - data.voted.length}
            </SimpleRow>
            <SimpleRow label={t('yeas_unl')}>
              {data.voted.filter((voted) => voted.unl !== false).length}
            </SimpleRow>
            <SimpleRow label={t('nays_unl')}>
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
      <SimpleRow label={t('enabled_on')}>
        <RouteLink to={TRANSACTION_ROUTE} params={{ identifier: data.tx_hash }}>
          {' '}
          {data.date}
        </RouteLink>
      </SimpleRow>
    ) : (
      <SimpleRow label={t('enabled_on')}>{data.date}</SimpleRow>
    )

  const rowIndex = renderRowIndex()

  const details = `https://xrpl.org/known-amendments.html#${data.name.toLowerCase()}`

  return (
    <>
      <div className="rows">
        <SimpleRow label={t('name')}>{data.name}</SimpleRow>
        <SimpleRow label={t('amendment_id')}>{data.amendment_id}</SimpleRow>
        <SimpleRow label={t('introduced_in')}>
          {`v${data.rippled_version}`}
        </SimpleRow>
        {data.voting_status === 'voting' ? (
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
        <SimpleRow label={t('status')}>
          {renderStatus(data.voting_status)}
        </SimpleRow>
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
    </>
  )
}
