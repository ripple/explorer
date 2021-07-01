import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { ACCOUNT_ZERO } from '../transactionUtils';

class Sequence extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t, addContextHelp, sequence, ticketSequence, account } = this.props;
    const isPseudoTransaction = account === ACCOUNT_ZERO;

    return (
      <span>
        {sequence === 0 && !isPseudoTransaction ? (
          <span className="row">
            {ticketSequence}
            {' ('}
            {addContextHelp && addContextHelp === true ? t('ticket_used') : t('ticket')}
            {')'}
          </span>
        ) : (
          sequence
        )}
      </span>
    );
  }
}

Sequence.propTypes = {
  t: PropTypes.func,
  sequence: PropTypes.number,
  ticketSequence: PropTypes.number,
  addContextHelp: PropTypes.bool,
  account: PropTypes.string
};

Sequence.defaultProps = {
  t: d => d,
  sequence: PropTypes.number,
  ticketSequence: 0,
  addContextHelp: false,
  account: ''
};

export default translate()(Sequence);
