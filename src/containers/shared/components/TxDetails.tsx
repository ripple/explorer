import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Currency from './Currency';
import { CURRENCY_OPTIONS, DATE_OPTIONS, ACCOUNT_FLAGS, decodeHex } from '../transactionUtils';
import { localizeNumber, localizeDate } from '../utils';

interface Instructions {
  owner: string;
  sequence: number;
  ticketSequence: number;
  fulfillment: string;
  finishAfter: string;
  cancelAfter: string;
  condition: string;
  quorum: number;
  max: any;
  signers: any[];
  domain: string;
  email_hash: string;
  message_key: string;
  set_flag: string;
  clear_flag: string;
  key: string;
  limit: any;
  pair: string;
  sourceTag: number;
  source: string;
  claimed: any;
  channel_amount: number;
  remaining: number;
  renew: boolean;
  close: boolean;
  deleted: boolean;
  gets: any;
  pays: any;
  price: string;
  cancel: number;
  convert: any;
  amount: any;
  destination: string;
  partial: boolean;
}

interface Props {
  instructions: Instructions;
  type?: string;
  language: string;
  t: (s: string) => string;
}

const TxDetails = (props: Props) => {
  function renderAmount(d: any): ReactElement {
    const { language } = props;
    const options = { ...CURRENCY_OPTIONS, currency: d.currency };
    const amount = localizeNumber(d.amount, language, options);
    const { issuer, currency } = d;

    return (
      <span className="amount">
        {amount}
        <Currency issuer={issuer} currency={currency} />
      </span>
    );
  }

  function renderEscrowFinish(): ReactElement {
    const { t, instructions } = props;
    const { amount, owner, sequence, fulfillment, ticketSequence } = instructions;
    return (
      <div className="escrow">
        {owner && (
          <div>
            <span className="label">{t('finish_escrow')}</span>
            <span className="account">{owner}</span>
            <span> -{sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}</span>
          </div>
        )}
        {amount && (
          <div>
            <span className="label">{t('amount')}</span>
            {renderAmount(amount)}
          </div>
        )}
        {fulfillment && (
          <div>
            <span className="label">{t('fulfillment')}</span>
            <span className="fulfillment"> {fulfillment} </span>
          </div>
        )}
      </div>
    );
  }

  function renderEscrowCancel(): ReactElement {
    const { t, instructions } = props;
    const { owner, sequence, ticketSequence } = instructions;
    return (
      <div className="escrow">
        {owner && (
          <div>
            <span className="label">{t('cancel_escrow')}</span>
            <span className="account"> {owner} </span>
            <span> -{sequence !== 0 ? sequence : `${ticketSequence} (Ticket)`}</span>
          </div>
        )}
      </div>
    );
  }

  function renderEscrowCreate(): ReactElement {
    const { t, language, instructions } = props;
    const { amount, destination, finishAfter, cancelAfter, condition } = instructions;
    return (
      <div className="escrow">
        {amount && (
          <div>
            <span className="label">{t('amount')}</span>
            {renderAmount(amount)}
          </div>
        )}
        {destination && (
          <div>
            <span className="label">{t('destination')}</span>
            <span className="account"> {destination} </span>
          </div>
        )}
        {condition && (
          <div>
            <span className="label">{t('condition')}</span>
            <span className="condition"> {condition} </span>
          </div>
        )}
        {finishAfter && (
          <div>
            <span className="label">{t('finish_after')}</span>
            <span> {localizeDate(Date.parse(finishAfter), language, DATE_OPTIONS)} UTC </span>
          </div>
        )}
        {cancelAfter && (
          <div>
            <span className="label">{t('cancel_after')}</span>
            <span> {localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS)} UTC </span>
          </div>
        )}
      </div>
    );
  }

  function renderSignerListSet(): ReactElement {
    const { t, instructions } = props;
    const { quorum, max, signers } = instructions;
    return (
      <div>
        <span className="label">{t('signers')}:</span> <span>{signers.length}</span>
        {' - '}
        <span className="label">{t('quorum')}:</span> <span>{`${quorum}/${max}`}</span>
      </div>
    );
  }

  function renderAccountSet(): ReactElement {
    const { t, instructions } = props;
    return (
      <>
        {instructions.domain && (
          <div>
            <span className="label">{t('domain')}:</span>{' '}
            <span className="domain">{decodeHex(instructions.domain)}</span>
          </div>
        )}
        {instructions.email_hash && (
          <div>
            <span className="label">{t('email_hash')}:</span>{' '}
            <span className="email-hash">{instructions.email_hash}</span>
          </div>
        )}
        {instructions.message_key && (
          <div>
            <span className="label">{t('message_key')}:</span>{' '}
            <span className="message-key">{instructions.message_key}</span>
          </div>
        )}
        {instructions.set_flag && (
          <div>
            <span className="label">{t('set_flag')}:</span>{' '}
            <span className="flag">
              {ACCOUNT_FLAGS[instructions.set_flag] || instructions.set_flag}
            </span>
          </div>
        )}
        {instructions.clear_flag && (
          <div>
            <span className="label">{t('clear_flag')}:</span>{' '}
            <span className="flag">
              {ACCOUNT_FLAGS[instructions.clear_flag] || instructions.clear_flag}
            </span>
          </div>
        )}
        {Object.keys(instructions).length === 0 && (
          <div className="empty">{t('no_account_settings')}</div>
        )}
      </>
    );
  }

  function renderSetRegularKey(): ReactElement {
    const { t, instructions } = props;
    const { key } = instructions;
    return key ? (
      <div className="setregularkey">
        <span className="label">{t('regular_key')}</span>:<span className="key">{key}</span>
      </div>
    ) : (
      <div className="unsetregularkey">{t('unset_regular_key')}</div>
    );
  }

  function renderTrustSet(): ReactElement {
    const { t, instructions } = props;
    const { limit } = instructions;
    return (
      <div className="trustset">
        <span className="label">{t('set_limit')}</span>
        {renderAmount(limit)}
      </div>
    );
  }

  function renderOfferCreate(): ReactElement | null {
    const { t, instructions } = props;
    const { gets, pays, price, pair, cancel } = instructions;

    return pays && gets ? (
      <div className="offercreate">
        <div className="price">
          <span className="label"> {t('price')}:</span>
          <span className="amount">
            {` ${Number(price)} `}
            {pair}
          </span>
        </div>
        <div className="amounts">
          <span className="label">{t('buy')}</span>
          {renderAmount(gets)}
          <span className="label">{`- ${t('sell')}`}</span>
          {renderAmount(pays)}
        </div>
        {cancel && (
          <div className="cancel">
            <span className="label">{t('cancel_offer')}</span>
            {` #`}
            <span className="sequence">{cancel}</span>
          </div>
        )}
      </div>
    ) : null;
  }

  function renderOfferCancel(): ReactElement {
    const { t, instructions } = props;
    const { cancel } = instructions;
    return (
      <div className="offercancel">
        <span className="label">{t('cancel_offer')}</span>
        {` #`}
        <span className="sequence">{cancel}</span>
      </div>
    );
  }

  function renderPayment(): ReactElement | null {
    const { t, instructions } = props;
    const { convert, amount, destination, partial, sourceTag } = instructions;

    if (convert) {
      return (
        <div className="payment conversion">
          <span className="label">{t('convert_maximum')}</span>
          {renderAmount(convert)}
          <span>{t('to')}</span>
          {renderAmount(amount)}
          {partial && <div className="partial-payment">{t('partial_payment_allowed')}</div>}
        </div>
      );
    }

    return amount ? (
      <div className="payment">
        <span className="label">{t('send')}</span>
        {renderAmount(amount)}
        <span>{t('to')}</span>
        <span className="account"> {destination} </span>
        {sourceTag !== undefined && (
          <div className="st">
            {t('source_tag')}
            {': '}
            <span>{sourceTag}</span>
          </div>
        )}
        {partial && <div className="partial-payment">{t('partial_payment_allowed')}</div>}
      </div>
    ) : null;
  }

  function renderPaymentChannelCreate(): ReactElement {
    const { t, instructions } = props;
    const { amount, source, destination } = instructions;

    return (
      <div className="paymentChannelCreate">
        <div>
          <span className="label">{t('source')}</span>
          <span className="account">{source}</span>
        </div>
        <div>
          <span className="label">{t('destination')}</span>
          <span className="account"> {destination} </span>
        </div>
        <div>
          <span className="label">{t('channel_amount')}</span>
          {renderAmount(amount)}
        </div>
      </div>
    );
  }

  function renderPaymentChannelClaim(): ReactElement {
    const { t, instructions } = props;
    const {
      source,
      destination,
      claimed,
      channel_amount: amount,
      remaining,
      renew,
      close,
      deleted,
    } = instructions;

    return (
      <div className="paymentChannelClaim">
        {source && (
          <div>
            <span className="label">{t('source')}</span>
            <span className="account"> {source} </span>
          </div>
        )}
        {destination && (
          <div>
            <span className="label">{t('destination')}</span>
            <span className="account"> {destination} </span>
          </div>
        )}
        {claimed && (
          <div>
            <span className="label">{t('claimed')}</span>
            {renderAmount(claimed)}
            {remaining && amount && (
              <span>
                {'('}
                {renderAmount(remaining)}
                <span>{t('out_of')}</span>
                {renderAmount(amount)}
                {t('remaining')}
                {')'}
              </span>
            )}
          </div>
        )}
        {amount && !claimed && (
          <div>
            <span className="label">{t('channel_amount')}</span>
            {renderAmount(amount)}
          </div>
        )}
        {renew && <div className="flag">{t('renew_channel')}</div>}
        {close && <div className="flag">{t('close_request')}</div>}
        {deleted && <div className="closed">{t('payment_channel_closed')}</div>}
      </div>
    );
  }

  const { type } = props;
  const functionMap: { [key: string]: () => ReactElement | null } = {
    renderEscrowFinish,
    renderEscrowCancel,
    renderEscrowCreate,
    renderSignerListSet,
    renderAccountSet,
    renderSetRegularKey,
    renderTrustSet,
    renderOfferCreate,
    renderOfferCancel,
    renderPayment,
    renderPaymentChannelCreate,
    renderPaymentChannelClaim,
  };
  if (functionMap[`render${type}`]) {
    return functionMap[`render${type}`]();
  }

  return null;
};

TxDetails.propTypes = {
  instructions: PropTypes.shape({
    owner: PropTypes.string,
    sequence: PropTypes.number,
    ticketSequence: PropTypes.number,
    fulfillment: PropTypes.string,
    finishAfter: PropTypes.string,
    cancelAfter: PropTypes.string,
    condition: PropTypes.string,
    quorum: PropTypes.number,
    max: PropTypes.shape({}),
    signers: PropTypes.arrayOf(PropTypes.shape({})),
    domain: PropTypes.string,
    email_hash: PropTypes.string,
    message_key: PropTypes.string,
    set_flag: PropTypes.string,
    clear_flag: PropTypes.string,
    key: PropTypes.string,
    limit: PropTypes.shape({}),
    pair: PropTypes.string,
    sourceTag: PropTypes.number,
    source: PropTypes.string,
    claimed: PropTypes.shape({}),
    channel_amount: PropTypes.number,
    remaining: PropTypes.number,
    renew: PropTypes.bool,
    close: PropTypes.bool,
    deleted: PropTypes.bool,
    gets: PropTypes.shape({}),
    pays: PropTypes.shape({}),
    price: PropTypes.string,
    cancel: PropTypes.number,
    convert: PropTypes.shape({}),
    amount: PropTypes.shape({}),
    destination: PropTypes.string,
    partial: PropTypes.bool,
  }),
  type: PropTypes.string,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

TxDetails.defaultProps = {
  instructions: {},
  type: null,
};

export default translate()(TxDetails);
