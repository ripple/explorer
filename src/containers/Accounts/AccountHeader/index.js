import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadAccountState } from './actions';
import Loader from '../../shared/components/Loader';
import '../../shared/css/nested-menu.css';
import './styles.css';
import './balance-selector.css';
import BalanceSelector from './BalanceSelector';
import Account from '../../shared/components/Account';
import { localizeNumber } from '../../shared/utils';
import UrlContext from '../../shared/urlContext';

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
};

class AccountHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBalanceSelector: false,
    };
  }

  componentDidMount() {
    const { actions, accountId } = this.props;
    const rippledUrl = this.context;
    actions.loadAccountState(accountId, rippledUrl);
  }

  componentDidUpdate(prevProps) {
    const rippledUrl = this.context;
    const { accountId, actions } = this.props;

    if (prevProps.accountId !== accountId) {
      actions.loadAccountState(accountId, rippledUrl);
    }
  }

  toggleBalanceSelector(force) {
    this.setState(prevState => ({
      showBalanceSelector: force !== undefined ? force : !prevState.showBalanceSelector,
    }));
  }

  renderBalancesSelector() {
    const { t, data, language, onSetCurrencySelected, currencySelected } = this.props;
    const { showBalanceSelector } = this.state;
    const { balances = {} } = data;

    return (
      Object.keys(balances).length > 1 && (
        <div className="balance-selector-container">
          <BalanceSelector
            language={language}
            text={`${Object.keys(balances).length - 1} ${t('accounts.other_balances')}`}
            expandMenu={showBalanceSelector}
            balances={balances}
            onClick={() => this.toggleBalanceSelector()}
            onMouseLeave={() => this.toggleBalanceSelector(false)}
            onSetCurrencySelected={currency => onSetCurrencySelected(currency)}
            currencySelected={currencySelected}
          />
        </div>
      )
    );
  }

  renderPaymentChannels() {
    const { data, t, language } = this.props;
    const { paychannels } = data;
    return (
      paychannels && (
        <div className="paychannels secondary">
          <div className="title">{t('payment_channels')}</div>
          <ul>
            <li>
              <b>{localizeNumber(paychannels.total_available, language, CURRENCY_OPTIONS)}</b>
              <span className="label"> {t('available_in')} </span>
              <b>{localizeNumber(paychannels.channels.length, language)}</b>
              <span className="label"> {t('channels')} </span>
            </li>
          </ul>
        </div>
      )
    );
  }

  renderEscrows() {
    const { data, t, language } = this.props;
    const { escrows } = data;
    return (
      escrows && (
        <div className="escrows secondary">
          <div className="title">{t('escrows')}</div>
          <ul>
            <li>
              <span className="label">{t('inbound_total')}: </span>
              <b>{localizeNumber(escrows.totalIn, language, CURRENCY_OPTIONS)}</b>
            </li>
            <li>
              <span className="label">{t('outbound_total')}: </span>
              <b>{localizeNumber(escrows.totalOut, language, CURRENCY_OPTIONS)}</b>
            </li>
          </ul>
        </div>
      )
    );
  }

  renderSignerList() {
    const { data, t } = this.props;
    const { signerList } = data;
    return (
      signerList && (
        <div className="signerList secondary">
          <div className="title">{t('signers')}</div>
          <ul>
            {signerList.signers.map(d => (
              <li key={d.account}>
                <Account account={d.account} />
                <span className="weight">
                  <span className="label">{` ${t('weight')}: `}</span>
                  <b>{d.weight}</b>
                </span>
              </li>
            ))}
            <li className="quorum">
              <b>{signerList.quorum}</b>
              <span className="label"> {t('out_of')} </span>
              <b>{signerList.max}</b>
              <span className="label"> {t('required')}</span>
            </li>
          </ul>
        </div>
      )
    );
  }

  // TODO: show X-address on 'classic' account pages

  renderExtendedAddress() {
    const { data /* , t */ } = this.props;
    const { xAddress } = data; // undefined when page has not yet finished loading

    let messageAboutTag = '';
    if (xAddress && xAddress.tag !== false) {
      messageAboutTag = (
        <li className="tag-info">
          <span>
            <span role="img" aria-label="Caution">
              ⚠️
            </span>{' '}
            This address contains a tag, indicating it may refer to a hosted wallet. The balance and
            transactions below apply to the entire account. They are not filtered to the specified
            destination tag.
          </span>
        </li>
      );
    }

    // TODO: Translate everything e.g. {t('signers')}
    return (
      xAddress && (
        <div className="xAddress secondary">
          <div className="title">Extended Address (X-address) Details</div>
          <p>
            {xAddress.classicAddress}
            {xAddress.tag ? `:${xAddress.tag}` : ''}
          </p>
          <ul>
            <li key={xAddress.classicAddress}>
              <span className="classicAddress">
                <span className="label">Classic Address: </span>
                <Account account={xAddress.classicAddress} /> {/* TODO: Add [copy] button */}
              </span>
            </li>
            <li className="tag">
              <span className="label">Tag: </span>
              <span className="tag">{xAddress.tag === false ? 'false' : xAddress.tag}</span>
            </li>
            <li className="network">
              <span className="label">Network: </span>
              <span className="network">{xAddress.test ? 'Testnet' : 'Mainnet'}</span>
            </li>
            {messageAboutTag}
          </ul>
        </div>
      )
    );
  }

  renderInfo() {
    const { data, t, language } = this.props;
    const { info } = data;
    return (
      info && (
        <div className="info secondary">
          <div className="title">{t('account_info')}</div>
          <ul>
            <li>
              <span className="label"> {t('reserve')}: </span>
              <b>{localizeNumber(info.reserve || 0.0, language, CURRENCY_OPTIONS)}</b>
            </li>
            <li>
              <span className="label"> {t('current_sequence')}: </span>
              <b>{localizeNumber(info.sequence, language)}</b>
            </li>
            {info.ticketCount && (
              <li>
                <span className="label"> {t('ticket_count')}: </span>
                <b>{localizeNumber(info.ticketCount, language)}</b>
              </li>
            )}
            {info.domain && (
              <li>
                <span className="label"> {t('domain')}: </span>
                <a href={`http://${info.domain}`}>{info.domain}</a>
              </li>
            )}
            {info.email_hash && (
              <li>
                <span className="label"> {t('email_hash')}: </span>
                <b>{info.email_hash}</b>
              </li>
            )}
            {info.flags.length ? (
              <li className="flags">
                <ul>
                  {info.flags.map(flag => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        </div>
      )
    );
  }

  renderHeaderContent() {
    const { data, language, currencySelected } = this.props;
    const { balances = {} } = data;
    const balance = localizeNumber(balances[currencySelected] || 0.0, language, {
      style: 'currency',
      currency: currencySelected,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return (
      <div className="section header-container">
        <div className="column first">
          {this.renderExtendedAddress()}
          <div className="secondary balance">
            <div className="title">{`${currencySelected} Balance`}</div>
            <div className="value">{balance}</div>
            {this.renderBalancesSelector()}
          </div>
          {this.renderSignerList()}
        </div>
        <div className="column second">
          {this.renderInfo()}
          {this.renderEscrows()}
          {this.renderPaymentChannels()}
        </div>
      </div>
    );
  }

  render() {
    const { accountId, loading, data } = this.props;
    const { xAddress } = data;
    return (
      <div className="box account-header">
        <div className="section box-header">
          <h2 className={xAddress ? 'xAddress' : 'classic'}>{accountId}</h2>
        </div>
        <div className="box-content">{loading ? <Loader /> : this.renderHeaderContent()}</div>
      </div>
    );
  }
}

AccountHeader.contextType = UrlContext;

AccountHeader.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  onSetCurrencySelected: PropTypes.func.isRequired,
  currencySelected: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    balances: PropTypes.shape({
      XRP: PropTypes.number,
    }),
    paychannels: PropTypes.shape({
      total_available: PropTypes.string,
      channels: PropTypes.shape({
        length: PropTypes.number,
      }),
    }),
    escrows: PropTypes.shape({
      totalIn: PropTypes.number,
      totalOut: PropTypes.number,
    }),
    signerList: PropTypes.shape({
      signers: PropTypes.arrayOf(
        PropTypes.shape({
          account: PropTypes.string.isRequired,
          weight: PropTypes.number.isRequired,
        })
      ),
      quorum: PropTypes.number,
      max: PropTypes.number,
    }),
    info: PropTypes.shape({
      reserve: PropTypes.number,
      sequence: PropTypes.number,
      ticketCount: PropTypes.number,
      domain: PropTypes.string,
      email_hash: PropTypes.string,
      flags: PropTypes.arrayOf(PropTypes.string),
    }),
    xAddress: PropTypes.shape({
      classicAddress: PropTypes.string,
      tag: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      test: PropTypes.bool,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadAccountState: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  state => ({
    language: state.app.language,
    loading: state.accountHeader.loading,
    data: state.accountHeader.data,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadAccountState,
      },
      dispatch
    ),
  })
)(translate()(AccountHeader));
