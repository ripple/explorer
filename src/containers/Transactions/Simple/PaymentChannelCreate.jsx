import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY_OPTIONS, DATE_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber, localizeDate } from '../../shared/utils';
import Currency from '../../shared/components/Currency';
import Account from '../../shared/components/Account';

const PaymentChannelCreate = props => {
  const { data, language, t } = props;
  const {
    amount,
    source,
    destination,
    delay,
    cancelAfter,
    expiration,
    channel
  } = data.instructions;
  const options = { ...CURRENCY_OPTIONS, currency: amount.currency };
  const amt = localizeNumber(amount.amount, language, options);
  const caDate = localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS);
  const exDate = localizeDate(Date.parse(expiration), language, DATE_OPTIONS);
  const dParts = destination.split(':');
  const sParts = source.split(':');

  return (
    <>
      <div className="row">
        <div className="label">{t('amount')}</div>
        <div className="value">
          {amt}
          <Currency {...amount} />
        </div>
      </div>
      {sParts[1] && (
        <div className="row">
          <div className="label">{t('source_tag')}</div>
          <div className="value">{sParts[1]}</div>
        </div>
      )}
      <div className="row">
        <div className="label">{t('destination')}</div>
        <div className="value">
          <Account account={dParts[0]} />
          {dParts[1] && <span className="dt">:{dParts[1]}</span>}
        </div>
      </div>
      {delay && (
        <div className="row">
          <div className="label">{t('settle_delay')}</div>
          <div className="value">
            {localizeNumber(delay, language)} {t('seconds_short')}
          </div>
        </div>
      )}
      {expiration && (
        <div className="row">
          <div className="label">{t('expiration')}</div>
          <div className="value date">
            {exDate} {DATE_OPTIONS.timeZone}
          </div>
        </div>
      )}
      {cancelAfter && (
        <div className="row">
          <div className="label">{t('cancel_after')}</div>
          <div className="value date">
            {caDate} {DATE_OPTIONS.timeZone}
          </div>
        </div>
      )}
      {channel && (
        <div className="row">
          <div className="label">{t('channel_id')}</div>
          <div className="value channel">{channel}</div>
        </div>
      )}
    </>
  );
};

PaymentChannelCreate.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      amount: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string
      }),
      source: PropTypes.shape({
        split: PropTypes.func
      }),
      destination: PropTypes.shape({
        split: PropTypes.func
      }),
      channel: PropTypes.string,
      delay: PropTypes.number,
      cancelAfter: PropTypes.string,
      expiration: PropTypes.string
    })
  }).isRequired,
  language: PropTypes.string.isRequired
};

export default PaymentChannelCreate;
