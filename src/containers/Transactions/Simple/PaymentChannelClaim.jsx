import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber } from '../../shared/utils';
import Currency from '../../shared/components/Currency';
import Account from '../../shared/components/Account';

const PaymentChannelClaim = props => {
  const { data, language, t } = props;
  const {
    channel_amount: amount,
    claimed,
    total_claimed: total,
    source = '',
    destination = '',
    channel,
    renew,
    close,
    deleted,
  } = data.instructions;
  const options = { ...CURRENCY_OPTIONS, currency: 'XRP' };
  const amt = amount ? localizeNumber(amount.amount, language, options) : null;
  const claimAmt = claimed ? localizeNumber(claimed.amount, language, options) : null;
  const totalAmt = total ? localizeNumber(total.amount, language, options) : null;
  const dParts = destination.split(':');
  const sParts = source.split(':');

  return (
    <>
      {amount && (
        <div className="row">
          <div className="label">{t('channel_amount')}</div>
          <div className="value">
            {amt}
            <Currency currency={amount.currency} amount={amount.amount} />
          </div>
        </div>
      )}
      {claimed && (
        <div className="row">
          <div className="label">{t('amount_claimed')}</div>
          <div className="value">
            {claimAmt}
            <Currency amount={claimed.amount} />
          </div>
        </div>
      )}
      {total && (
        <div className="row">
          <div className="label">{t('total_claimed')}</div>
          <div className="value">
            {totalAmt}
            <Currency currency={total.currency} amount={total.amount} />
          </div>
        </div>
      )}
      {source && (
        <div className="row">
          <div className="label">{t('source')}</div>
          <div className="value">
            <Account account={sParts[0]} />
            {sParts[1] && <span className="dt">:{sParts[1]}</span>}
          </div>
        </div>
      )}
      {destination && (
        <div className="row">
          <div className="label">{t('destination')}</div>
          <div className="value">
            <Account account={dParts[0]} />
            {dParts[1] && <span className="dt">:{dParts[1]}</span>}
          </div>
        </div>
      )}
      {channel && (
        <div className="row">
          <div className="label">{t('channel_id')}</div>
          <div className="value channel">{channel}</div>
        </div>
      )}
      {renew && (
        <div className="row">
          <div className="label">{null}</div>
          <div className="value flag">{t('renew_channel')}</div>
        </div>
      )}
      {close && (
        <div className="row">
          <div className="label">{null}</div>
          <div className="value flag">{t('close_request')}</div>
        </div>
      )}
      {deleted && (
        <div className="row">
          <div className="label">{null}</div>
          <div className="value closed">{t('payment_channel_closed')}</div>
        </div>
      )}
    </>
  );
};

PaymentChannelClaim.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      channel_amount: PropTypes.shape({}),
      claimed: PropTypes.shape({
        amount: PropTypes.number,
      }),
      total_claimed: PropTypes.shape({}),
      source: PropTypes.shape({
        split: PropTypes.func,
      }),
      destination: PropTypes.shape({
        split: PropTypes.func,
      }),
      channel: PropTypes.string,
      renew: PropTypes.bool,
      close: PropTypes.bool,
      deleted: PropTypes.bool,
    }),
  }).isRequired,
  language: PropTypes.string.isRequired,
};

export default PaymentChannelClaim;
