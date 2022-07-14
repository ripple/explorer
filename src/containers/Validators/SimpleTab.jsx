import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { localizeDate, BREAKPOINTS } from '../shared/utils';
import Simple from './Simple';
import './simpleTab.css';
import successIcon from '../shared/images/success.png';

const TIME_ZONE = 'UTC';
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
};

class SimpleTab extends Component {
  renderRowIndex({ last_ledger_time: lastLedgerTime, ledger_index: ledgerIndex, unl, updated }) {
    const { t } = this.props;
    const unlRow = unl && (
      <div className="row">
        <div className="label">UNL</div>
        <div className="value unl yes">
          <img src={successIcon} title={unl} alt={unl} /> {unl}
        </div>
      </div>
    );
    return (
      <>
        <div className="row">
          <div className="label">Last Ledger {t('formatted_date', { timeZone: TIME_ZONE })}</div>
          <div className="value">{lastLedgerTime}</div>
        </div>
        <div className="row">
          <div className="label">Last {t('ledger_index')}</div>
          <div className="value">
            <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
          </div>
        </div>
        {unlRow}
        <div className="row">
          <div className="label">Updated {t('formatted_date', { timeZone: TIME_ZONE })}</div>
          <div className="value">{updated}</div>
        </div>
      </>
    );
  }

  renderCartIndex({ last_ledger_time: lastLedgerTime, ledger_index: ledgerIndex, unl, updated }) {
    const { t } = this.props;
    const unlRow = unl && (
      <div className="val">
        <div className="title">UNL</div>
        <div className="val unl yes">
          <img src={successIcon} title={unl} alt={unl} /> {unl}
        </div>
      </div>
    );
    return (
      <div className="index">
        <div className="title">Last Ledger {t('formatted_date', { timeZone: TIME_ZONE })}</div>
        <div className="val">{lastLedgerTime}</div>
        <div className="title">Last {t('ledger_index')}</div>
        <div className="val">
          <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex.toLocaleString()}</Link>
        </div>
        {unlRow}
      </div>
    );
  }

  render() {
    const { t, language, data, width } = this.props;

    const formattedData = {
      ...data,
      last_ledger_time: data.last_ledger_time
        ? localizeDate(new Date(data.last_ledger_time), language, DATE_OPTIONS)
        : '',
      updated: data.updated ? localizeDate(new Date(data.updated), language, DATE_OPTIONS) : '',
    };

    let rowIndex;
    let cartIndex;
    if (width >= BREAKPOINTS.landscape) {
      rowIndex = null;
      cartIndex = this.renderCartIndex(formattedData);
    } else {
      cartIndex = null;
      rowIndex = this.renderRowIndex(formattedData);
    }

    return (
      <div className="simple-body-validator">
        <div className="rows">
          <Simple t={t} language={language} data={data} />
          {rowIndex}
        </div>
        {cartIndex}
        <div className="clear" />
      </div>
    );
  }
}

SimpleTab.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
      PropTypes.bool,
    ])
  ).isRequired,
};

export default SimpleTab;
