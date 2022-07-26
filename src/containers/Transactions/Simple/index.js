import React from 'react';
import PropTypes from 'prop-types';
import OfferCancel from './OfferCancel';
import Payment from './Payment';
import PaymentChannelCreate from './PaymentChannelCreate';
import PaymentChannelClaim from './PaymentChannelClaim';
import PaymentChannelFund from './PaymentChannelFund';
import EscrowCreate from './EscrowCreate';
import EscrowCancel from './EscrowCancel';
import EscrowFinish from './EscrowFinish';
import TrustSet from './TrustSet';
import SetRegularKey from './SetRegularKey';
import AccountSet from './AccountSet';
import SignerListSet from './SignerListSet';
import DepositPreauth from './DepositPreauth';
import EnableAmendment from './EnableAmendment';
import UNLModify from './UNLModify';
import AccountDelete from './AccountDelete';
import TicketCreate from './TicketCreate';
import NFTokenAcceptOffer from './NFTokenAcceptOffer';
import NFTokenBurn from './NFTokenBurn';
import NFTokenCancelOffer from './NFTokenCancelOffer';
import NFTokenCreateOffer from './NFTokenCreateOffer';
import NFTokenMint from './NFTokenMint';
import { transactionTypes } from '../../shared/components/Transaction';

const Simple = props => {
  const { t, data, language, type } = props;

  const SimpleComponent = transactionTypes[type]?.Simple;
  if (SimpleComponent) {
    return <SimpleComponent data={data} />;
  }

  switch (type) {
    case 'OfferCancel':
      return <OfferCancel t={t} data={data} />;
    case 'Payment':
      return <Payment t={t} language={language} data={data} />;
    case 'PaymentChannelCreate':
      return <PaymentChannelCreate t={t} language={language} data={data} />;
    case 'PaymentChannelClaim':
      return <PaymentChannelClaim t={t} language={language} data={data} />;
    case 'PaymentChannelFund':
      return <PaymentChannelFund t={t} language={language} data={data} />;
    case 'EscrowCreate':
      return <EscrowCreate t={t} language={language} data={data} />;
    case 'EscrowCancel':
      return <EscrowCancel t={t} language={language} data={data} />;
    case 'EscrowFinish':
      return <EscrowFinish t={t} language={language} data={data} />;
    case 'TrustSet':
      return <TrustSet t={t} language={language} data={data} />;
    case 'SetRegularKey':
      return <SetRegularKey t={t} language={language} data={data} />;
    case 'AccountSet':
      return <AccountSet t={t} language={language} data={data} />;
    case 'SignerListSet':
      return <SignerListSet t={t} language={language} data={data} />;
    case 'DepositPreauth':
      return <DepositPreauth t={t} language={language} data={data} />;
    case 'EnableAmendment':
      return <EnableAmendment t={t} language={language} data={data} />;
    case 'UNLModify':
      return <UNLModify t={t} language={language} data={data} />;
    case 'AccountDelete':
      return <AccountDelete t={t} language={language} data={data} />;
    case 'TicketCreate':
      return <TicketCreate t={t} language={language} data={data} />;
    case 'NFTokenAcceptOffer':
      return <NFTokenAcceptOffer t={t} language={language} data={data} />;
    case 'NFTokenBurn':
      return <NFTokenBurn t={t} language={language} data={data} />;
    case 'NFTokenCancelOffer':
      return <NFTokenCancelOffer t={t} language={language} data={data} />;
    case 'NFTokenCreateOffer':
      return <NFTokenCreateOffer t={t} language={language} data={data} />;
    case 'NFTokenMint':
      return <NFTokenMint t={t} language={language} data={data} />;
    default:
      return (
        <div className="not-supported">
          <div>
            {t('simple_not_supported')}
            <span className="type">{type}</span>
          </div>
          <div>{t('try_detailed_raw')}</div>
        </div>
      );
  }
};

Simple.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
};

export default Simple;
