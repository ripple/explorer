import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { localizeDate } from '../../shared/utils';
import { DATE_OPTIONS, RIPPLE_EPOCH, normalizeAmount } from '../../shared/transactionUtils';
import Account from '../../shared/components/Account';

const EscrowCreate = props => {
  const { t, language, data } = props;
  const cancelAfter = localizeDate(
    (data.tx.CancelAfter + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS
  );
  const finishAfter = localizeDate(
    (data.tx.FinishAfter + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS
  );
  const lines = [];

  if (data.tx.Destination !== data.tx.Account) {
    lines.push(
      <Trans key="line1" i18nKey="escrow_is_from">
        The escrow is from
        <Account account={data.tx.Account} />
        to
        <Account account={data.tx.Destination} />
      </Trans>
    );
  } else {
    lines.push(
      <Trans key="line2" i18nKey="escrow_is_created_by">
        the escrow was created by
        <Account account={data.tx.Account} />
        and the funds will be returned to the same account
      </Trans>
    );
  }

  if (data.tx.Condition) {
    lines.push(
      <div key="line3">
        {t('escrow_condition')}
        <span className="condition"> {data.tx.Condition}</span>
      </div>
    );
  }

  lines.push(
    <div key="line4">
      {t('escrowed_amount')}
      <b>
        {' '}
        {normalizeAmount(data.tx.Amount, language)}
        <small>XRP</small>
      </b>
    </div>
  );

  if (data.tx.CancelAfter) {
    lines.push(
      <div key="line5">
        {t('describe_cancel_after')}
        <span className="time">{` ${cancelAfter} ${DATE_OPTIONS.timeZone}`}</span>
      </div>
    );
  }

  if (data.tx.FinishAfter) {
    lines.push(
      <div key="line6">
        {t('describe_finish_after')}
        <span className="time">{` ${finishAfter} ${DATE_OPTIONS.timeZone}`}</span>
      </div>
    );
  }

  return lines;
};

EscrowCreate.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired
};

export default EscrowCreate;
