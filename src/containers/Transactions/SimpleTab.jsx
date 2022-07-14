import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { localizeDate, localizeNumber, BREAKPOINTS } from '../shared/utils';
import Account from '../shared/components/Account';
import Sequence from '../shared/components/Sequence';
import Simple from './Simple';
import './simpleTab.css';

const XRP_BASE = 1000000;
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
const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: '',
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
};
class SimpleTab extends Component {
  renderRowIndex(time, ledgerIndex, fee, account, sequence, ticketSequence) {
    const { t } = this.props;
    return (
      <>
        <div className="row">
          <div className="label">{t('formatted_date', { timeZone: TIME_ZONE })}</div>
          <div className="value">{time}</div>
        </div>
        <div className="row">
          <div className="label">{t('ledger_index')}</div>
          <div className="value">
            <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
          </div>
        </div>
        <div className="row">
          <div className="label">{t('account')}</div>
          <div className="value account">
            <Account account={account} />
          </div>
        </div>
        <div className="row">
          <div className="label">{t('sequence_number')}</div>
          <div className="value">
            <Sequence sequence={sequence} ticketSequence={ticketSequence} account={account} />
          </div>
        </div>
        <div className="row">
          <div className="label">{t('transaction_cost')}</div>
          <div className="value">{fee}</div>
        </div>
      </>
    );
  }

  renderCartIndex(time, ledgerIndex, fee, account, sequence, ticketSequence) {
    const { t } = this.props;
    return (
      <div className="index">
        <div className="title">{t('formatted_date', { timeZone: TIME_ZONE })}</div>
        <div className="val">{time}</div>
        <div className="title">{t('ledger_index')}</div>
        <div className="val">
          <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
        </div>
        <div className="title">{t('account')}</div>
        <div className="val account">
          <Account account={account} />
        </div>
        <div className="title">{t('sequence_number')}</div>
        <div className="val">
          <Sequence sequence={sequence} ticketSequence={ticketSequence} account={account} />
        </div>
        <div className="title">{t('transaction_cost')}</div>
        <div className="val">{fee}</div>
      </div>
    );
  }

  render() {
    const { t, language, data, width } = this.props;
    const { raw } = data;
    const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' };
    const time = localizeDate(new Date(raw.date), language, DATE_OPTIONS);
    const ledgerIndex = raw.ledger_index;
    const fee = raw.tx.Fee
      ? localizeNumber(Number.parseFloat(raw.tx.Fee) / XRP_BASE, language, numberOptions)
      : 0;

    let rowIndex;
    let cartIndex;
    if (width >= BREAKPOINTS.landscape) {
      rowIndex = null;
      cartIndex = this.renderCartIndex(
        time,
        ledgerIndex,
        fee,
        raw.tx.Account,
        raw.tx.Sequence,
        raw.tx.TicketSequence
      );
    } else {
      cartIndex = null;
      rowIndex = this.renderRowIndex(
        time,
        ledgerIndex,
        fee,
        raw.tx.Account,
        raw.tx.Sequence,
        raw.tx.TicketSequence
      );
    }

    return (
      <div className="simple-body-tx">
        <div className="rows">
          <Simple t={t} language={language} type={raw.tx.TransactionType} data={data.summary} />
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
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number, PropTypes.array])
  ).isRequired,
};

export default SimpleTab;
