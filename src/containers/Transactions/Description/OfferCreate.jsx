import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { localizeDate } from '../../shared/utils';
import {
  DATE_OPTIONS,
  CURRENCY_ORDER,
  RIPPLE_EPOCH,
  XRP_BASE,
  normalizeAmount
} from '../../shared/transactionUtils';
import Account from '../../shared/components/Account';

const normalize = amount => amount.value || amount / XRP_BASE;

const OfferCreate = props => {
  const { t, language, data } = props;
  const paysCurrency = data.tx.TakerPays.currency || 'XRP';
  const getsCurrency = data.tx.TakerGets.currency || 'XRP';
  const paysValue = normalize(data.tx.TakerPays);
  const getsValue = normalize(data.tx.TakerGets);
  const invert = CURRENCY_ORDER.indexOf(getsCurrency) > CURRENCY_ORDER.indexOf(paysCurrency);
  const lines = [];
  let rate = getsValue / paysValue;
  let pair;

  if (invert) {
    rate = 1 / rate;
    pair = `${getsCurrency}/${paysCurrency}`;
  } else {
    pair = `${paysCurrency}/${getsCurrency}`;
  }

  lines.push(
    <div key="line1">
      <Trans i18nKey="offer_create_desc_line_1">
        The account
        <Account account={data.tx.Account} />
        offered to pay
        <b>
          {normalizeAmount(data.tx.TakerGets, language)}
          <small>{data.tx.TakerGets.currency || 'XRP'}</small>
        </b>
        in order to receive
        <b>
          {normalizeAmount(data.tx.TakerPays, language)}
          <small>{data.tx.TakerPays.currency || 'XRP'}</small>
        </b>
      </Trans>
    </div>
  );

  lines.push(
    <div key="line2">
      {t('offer_create_desc_line_2')}
      <b>
        <span> {rate.toPrecision(5)}</span>
        <small>{pair}</small>
      </b>
    </div>
  );

  if (data.tx.OfferSequence) {
    lines.push(
      <div key="line3">
        {t('offer_create_desc_line_3')}
        <b> {data.tx.OfferSequence}</b>
      </div>
    );
  }

  if (data.tx.Expiration) {
    const unixT = (data.tx.Expiration + RIPPLE_EPOCH) * 1000;
    const today = new Date();
    const transString =
      unixT - today.getTime() > 0 ? 'offer_will_expire_desc' : 'offer_did_expire_desc';
    const date = `${localizeDate(unixT, language, DATE_OPTIONS)} ${DATE_OPTIONS.timeZone}`;

    lines.push(
      <Trans key="line4" i18nKey={transString}>
        The offer exires
        <span className="time">{date}</span>
        unless cancelled before
      </Trans>
    );
  }

  return lines;
};

OfferCreate.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired
};

export default OfferCreate;
