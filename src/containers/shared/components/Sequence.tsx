import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { ACCOUNT_ZERO } from '../transactionUtils';

interface Props {
  t: (s: string) => string;
  addContextHelp: boolean;
  sequence: number;
  ticketSequence: number;
  account: string;
}

const Sequence = (props: Props) => {
  const { t, addContextHelp, sequence, ticketSequence, account } = props;
  const isPseudoTransaction = account === ACCOUNT_ZERO;

  return (
    <span>
      {sequence === 0 && !isPseudoTransaction ? (
        <span className="row">
          {ticketSequence}
          {' ('}
          {addContextHelp && addContextHelp === true ? t('ticket_used') : t('ticket')})
        </span>
      ) : (
        sequence
      )}
    </span>
  );
};

Sequence.propTypes = {
  t: PropTypes.func,
  sequence: PropTypes.number,
  ticketSequence: PropTypes.number,
  addContextHelp: PropTypes.bool,
  account: PropTypes.string,
};

Sequence.defaultProps = {
  t: (d: string) => d,
  sequence: PropTypes.number,
  ticketSequence: 0,
  addContextHelp: false,
  account: '',
};

export default translate()(Sequence);
