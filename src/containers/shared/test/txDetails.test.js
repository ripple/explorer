import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18nTestConfig';
import Payment from '../../Transactions/test/mock_data/Payment.json';
import ConvertPayment from '../../Transactions/test/mock_data/Payment-convert.json';
import AccountSet from '../../Transactions/test/mock_data/AccountSet.json';
import EnableAmendment from '../../Transactions/test/mock_data/EnableAmendment.json';
import EscrowCreate from '../../Transactions/test/mock_data/EscrowCreate.json';
import EscrowCancel from '../../Transactions/test/mock_data/EscrowCancel.json';
import EscrowFinish from '../../Transactions/test/mock_data/EscrowFinish.json';
import OfferCreate from '../../Transactions/test/mock_data/OfferCreate.json';
import OfferCancel from '../../Transactions/test/mock_data/OfferCancel.json';
import PaymentChannelClaim from '../../Transactions/test/mock_data/PaymentChannelClaim.json';
import PaymentChannelCreate from '../../Transactions/test/mock_data/PaymentChannelCreate.json';
import PaymentChannelFund from '../../Transactions/test/mock_data/PaymentChannelFund.json';
import SetRegularKey from '../../Transactions/test/mock_data/SetRegularKey.json';
import SignerListSet from '../../Transactions/test/mock_data/SignerListSet.json';
import TrustSet from '../../Transactions/test/mock_data/TrustSet.json';
import UNLModify from '../../Transactions/test/mock_data/UNLModify.json';
import TxDetails from '../components/TxDetails';
import summarize from '../../../../server/lib/txSummary';

describe('TxDetails', () => {
  const createWrapper = (tx, width = 1200) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <TxDetails
          t={s => s}
          language="en-US"
          instructions={summarize(tx, true).details.instructions}
          type={tx.tx.TransactionType}
        />
      </I18nextProvider>
    );

  it('renders Payment without crashing', () => {
    const wrapper = createWrapper(Payment);
    wrapper.unmount();
  });

  it('renders Payment (convert) without crashing', () => {
    const wrapper = createWrapper(ConvertPayment);
    wrapper.unmount();
  });

  it('renders AccountSet without crashing', () => {
    const wrapper = createWrapper(AccountSet);
    wrapper.unmount();
  });

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment);
    wrapper.unmount();
  });

  it('renders EscrowCreate without crashing', () => {
    const wrapper = createWrapper(EscrowCreate);
    wrapper.unmount();
  });

  it('renders EscrowCancel without crashing', () => {
    const wrapper = createWrapper(EscrowCancel);
    wrapper.unmount();
  });

  it('renders EscrowFinish without crashing', () => {
    const wrapper = createWrapper(EscrowFinish);
    wrapper.unmount();
  });

  it('renders OfferCreate without crashing', () => {
    const wrapper = createWrapper(OfferCreate);
    wrapper.unmount();
  });

  it('renders OfferCancel without crashing', () => {
    const wrapper = createWrapper(OfferCancel);
    wrapper.unmount();
  });

  it('renders PaymentChannelCreate without crashing', () => {
    const wrapper = createWrapper(PaymentChannelCreate);
    wrapper.unmount();
  });

  it('renders PaymentChannelFund without crashing', () => {
    const wrapper = createWrapper(PaymentChannelFund);
    wrapper.unmount();
  });

  it('renders PaymentChannelClaim without crashing', () => {
    const wrapper = createWrapper(PaymentChannelClaim);
    wrapper.unmount();
  });

  it('renders SetRegularKey without crashing', () => {
    const wrapper = createWrapper(SetRegularKey);
    wrapper.unmount();
  });

  it('renders SignerListSet without crashing', () => {
    const wrapper = createWrapper(SignerListSet);
    wrapper.unmount();
  });

  it('renders TrustSet without crashing', () => {
    const wrapper = createWrapper(TrustSet);
    wrapper.unmount();
  });

  it('renders UNLModify without crashing', () => {
    const wrapper = createWrapper(UNLModify);
    wrapper.unmount();
  });
});
