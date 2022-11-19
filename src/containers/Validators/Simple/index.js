import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SimpleRow } from '../../shared/components/Transaction/SimpleRow'

const Simple = (props) => {
  const { data } = props
  const { t } = useTranslation()

  const renderAgreement = (className, d, label) =>
    d ? (
      <div className="row">
        <div className="label">{label}</div>
        <div
          className={`value ${className} score`}
          title={t('missed_validations', { count: d.missed })}
        >
          {Number.parseFloat(d.score).toFixed(5)}
          {d.incomplete && <span title={t('incomplete')}>*</span>}
        </div>
      </div>
    ) : (
      <div />
    )

  return (
    <>
      <SimpleRow label={t('domain')}>{data.domain || 'Unknown'}</SimpleRow>
      <SimpleRow label={t('rippled_version')} data-test="version">
        {data.server_version}
      </SimpleRow>
      <div className="row">
        <div className="label">Master Key</div>
        <div className="value">{data.master_key || 'Unknown'}</div>
      </div>
      <div className="row">
        <div className="label">Signing Key</div>
        <div className="value">{data.signing_key || 'Unknown'}</div>
      </div>
      <SimpleRow label={t('ledger')}>
        <Link to={`/ledgers/${data.ledger_index}`}>
          {data.ledger_hash || 'Unknown'}
        </Link>
      </SimpleRow>
      {renderAgreement('h1', data.agreement_1hour, 'Agreement (1 hour)')}
      {renderAgreement('h24', data.agreement_24hour, 'Agreement (24 hours)')}
      {renderAgreement('d30', data.agreement_30day, 'Agreement (30 days)')}
    </>
  )
}

Simple.propTypes = {
  data: PropTypes.shape({
    ledger_hash: PropTypes.string.isRequired,
    ledger_index: PropTypes.number.isRequired,
    domain: PropTypes.string,
    master_key: PropTypes.string,
    server_version: PropTypes.string,
    signing_key: PropTypes.string,
    agreement_1hour: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool,
    }),
    agreement_24hour: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool,
    }),
    agreement_30day: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool,
    }),
  }).isRequired,
}

export default Simple
