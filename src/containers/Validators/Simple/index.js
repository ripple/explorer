import React from 'react';
import PropTypes from 'prop-types';

const Simple = props => {
  const { t, data /* , language */ } = props;

  const color = data.ledger_hash ? `#${data.ledger_hash.substr(0, 6)}` : '';

  const renderAgreement = (className, d, label) => {
    return d ? (
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
    );
  };

  return (
    <>
      <div className="row">
        <div className="label">Domain Name</div>
        <div className="value">{data.domain || 'Unknown'}</div>
      </div>
      <div className="row">
        <div className="label">Master Key</div>
        <div className="value account">{data.master_key || 'Unknown'}</div>
      </div>
      <div className="row">
        <div className="label">Signing Key</div>
        <div className="value account">{data.signing_key || 'Unknown'}</div>
      </div>
      <div className="row">
        <div className="label">Ledger</div>
        <a className="value account" style={{ color }} href={`/ledgers/${data.ledger_hash}`}>
          {data.ledger_hash || 'Unknown'}
        </a>
      </div>
      {renderAgreement('h1', data.agreement_1hour, 'Agreement (1 hour)')}
      {renderAgreement('h24', data.agreement_24hour, 'Agreement (24 hours)')}
      {renderAgreement('d30', data.agreement_30day, 'Agreement (30 days)')}
    </>
  );
};

Simple.propTypes = {
  t: PropTypes.func.isRequired,
  // language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    ledger_hash: PropTypes.string,
    domain: PropTypes.string,
    master_key: PropTypes.string,
    signing_key: PropTypes.string,
    agreement_1hour: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool
    }),
    agreement_24hour: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool
    }),
    agreement_30day: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      missed: PropTypes.number,
      incomplete: PropTypes.bool
    })
  }).isRequired
};

export default Simple;
