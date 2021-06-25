import React from 'react';
import PropTypes from 'prop-types';
import TrustSet from './TrustSet';
import Payment from './Payment';
import OfferCancel from './OfferCancel';
import OfferCreate from './OfferCreate';
import EscrowCreate from './EscrowCreate';
import EscrowCancel from './EscrowCancel';
import EscrowFinish from './EscrowFinish';
import PaymentChannelCreate from './PaymentChannelCreate';
import PaymentChannelClaim from './PaymentChannelClaim';
import PaymentChannelFund from './PaymentChannelFund';
import SetRegularKey from './SetRegularKey';
import AccountSet from './AccountSet';
import Sequence from '../../shared/components/Sequence';
import SignerListSet from './SignerListSet';
import DepositPreauth from './DepositPreauth';

const TransactionDescription = props => {
  const { t, data, language, instructions } = props;
  let body = null;

  if (!data || !data.tx) {
    return null;
  } else if (data.tx.TransactionType === 'OfferCreate') {
    body = <OfferCreate t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'OfferCancel') {
    body = <OfferCancel t={t} data={data} />;
  } else if (data.tx.TransactionType === 'Payment') {
    body = <Payment t={t} language={language} data={data} partial={instructions.partial} />;
  } else if (data.tx.TransactionType === 'TrustSet') {
    body = <TrustSet t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'EscrowCreate') {
    body = <EscrowCreate t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'EscrowCancel') {
    body = <EscrowCancel t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'EscrowFinish') {
    body = <EscrowFinish t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'PaymentChannelCreate') {
    body = <PaymentChannelCreate t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'PaymentChannelClaim') {
    body = <PaymentChannelClaim t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'PaymentChannelFund') {
    body = <PaymentChannelFund t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'SetRegularKey') {
    body = <SetRegularKey t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'AccountSet') {
    body = <AccountSet t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'SignerListSet') {
    body = <SignerListSet t={t} language={language} data={data} />;
  } else if (data.tx.TransactionType === 'DepositPreauth') {
    body = <DepositPreauth t={t} language={language} data={data} />;
  }

  return (
    <div className="section">
      <div className="title">{t('description')}</div>
      <div>
        {t('transaction_sequence')}
        <b>
          {' '}
          <Sequence
            sequence={data.tx.Sequence}
            ticketSequence={data.tx.TicketSequence}
            account={data.tx.Account}
            addContextHelp
          />
        </b>
      </div>
      {body}
    </div>
  );
};

TransactionDescription.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number, PropTypes.array])
  ).isRequired,
  instructions: PropTypes.shape({ partial: PropTypes.bool }).isRequired
};

export default TransactionDescription;
