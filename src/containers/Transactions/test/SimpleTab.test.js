import React from 'react';
import { mount, shallow } from 'enzyme';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter as Router } from 'react-router-dom';
import Payment from './mock_data/Payment.json';
import PaymentConvert from './mock_data/Payment-convert.json';
import AccountDelete from './mock_data/AccountDelete.json';
import AccountSet from './mock_data/AccountSet.json';
import EnableAmendment from './mock_data/EnableAmendment.json';
import EscrowCreate from './mock_data/EscrowCreate.json';
import EscrowCancel from './mock_data/EscrowCancel.json';
import EscrowFinish from './mock_data/EscrowFinish.json';
import OfferCancel from './mock_data/OfferCancel.json';
import PaymentChannelClaim from './mock_data/PaymentChannelClaim.json';
import PaymentChannelCreate from './mock_data/PaymentChannelCreate.json';
import PaymentChannelFund from './mock_data/PaymentChannelFund.json';
import SetRegularKey from './mock_data/SetRegularKey.json';
import SignerListSet from './mock_data/SignerListSet.json';
import DepositPreauth from './mock_data/DepositPreauth.json';
import TrustSet from './mock_data/TrustSet.json';
import UNLModify from './mock_data/UNLModify.json';
import TicketCreate from './mock_data/TicketCreate.json';
import SimpleTab from '../SimpleTab';
import summarize from '../../../rippled/lib/txSummary';
import i18n from '../../../i18nTestConfig';

describe('SimpleTab container', () => {
  const createWrapper = (tx, width = 1200) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SimpleTab
            t={s => s}
            language="en-US"
            data={{ raw: tx, summary: summarize(tx, true).details }}
            width={width}
          />
        </I18nextProvider>
      </Router>
    );

  const createShallowWrapper = (tx, width = 1200) =>
    shallow(
      <Router>
        <SimpleTab
          t={s => s}
          language="en-US"
          data={{ raw: tx, summary: summarize(tx, true).details }}
          width={width}
        />
      </Router>
    );

  it('renders Payment without crashing', () => {
    const wrapper = createWrapper(Payment);
    wrapper.unmount();
  });

  it('renders Payment (convert) without crashing', () => {
    const wrapper = createWrapper(PaymentConvert);
    wrapper.unmount();
  });

  it('renders AccountDelete without crashing', () => {
    const wrapper = createShallowWrapper(AccountDelete);
    wrapper.unmount();
  });

  it('renders AccountSet without crashing', () => {
    const wrapper = createWrapper(AccountSet);
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

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment);
    wrapper.unmount();
  });

  it('renders OfferCancel without crashing', () => {
    const wrapper = createWrapper(OfferCancel);
    wrapper.unmount();
  });

  it('renders PaymentChannelClaim without crashing', () => {
    const wrapper = createWrapper(PaymentChannelClaim);
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

  it('renders SetRegularKey without crashing', () => {
    const wrapper = createWrapper(SetRegularKey);
    wrapper.unmount();
  });

  it('renders SignerListSet without crashing', () => {
    const wrapper = createWrapper(SignerListSet);
    wrapper.unmount();
  });

  it('renders DepositPreauth without crashing', () => {
    const wrapper = createWrapper(DepositPreauth);
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

  it('renders TicketCreate without crashing', () => {
    const wrapper = createWrapper(TicketCreate);
    wrapper.unmount();
  });

  it('renders simple tab information', () => {
    const wrapper = createWrapper(Payment);
    expect(wrapper.find('.simple-body-tx').length).toBe(1);
    expect(wrapper.find('a').length).toBe(3);
    const index = wrapper.find('.index');
    expect(index.length).toBe(1);
    expect(index.contains(<div className="title">formatted_date</div>)).toBe(true);
    expect(index.contains(<div className="title">ledger_index</div>)).toBe(true);
    expect(index.contains(<div className="title">transaction_cost</div>)).toBe(true);
    expect(index.contains(<div className="title">sequence_number</div>)).toBe(true);
    wrapper.unmount();
  });

  it('renders ticket count', () => {
    const wrapper = createWrapper(TicketCreate, 800);
    expect(wrapper.find('.simple-body-tx').length).toBe(1);
    const ticketCount = wrapper.find('.ticket-count');
    expect(ticketCount.length).toBe(1);
    wrapper.unmount();
  });
});
