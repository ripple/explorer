import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  isValidClassicAddress,
  isValidXAddress,
  classicAddressToXAddress
} from 'ripple-address-codec';
import { isValidPayId as isValidPayString } from 'payid-lib';
import {
  analytics,
  ANALYTIC_TYPES,
  CURRENCY_REGEX,
  DECIMAL_REGEX,
  HASH_REGEX
} from '../shared/utils';
import './search.css';

const getIdType = id => {
  if (DECIMAL_REGEX.test(id)) {
    return 'ledgers';
  }
  if (isValidClassicAddress(id)) {
    return 'accounts';
  }
  if (HASH_REGEX.test(id)) {
    return 'transactions';
  }
  if (isValidXAddress(id) || isValidClassicAddress(id.split(':')[0])) {
    return 'accounts'; // TODO: Consider a new path/page specific to X-addresses
  }
  if (isValidPayString(id) || isValidPayString(id.replace('@', '$'))) {
    return 'paystrings';
  }
  if (CURRENCY_REGEX.test(id) && isValidClassicAddress(id.split('.')[1])) {
    return 'token';
  }

  return 'invalid';
};

// normalize classicAddress:tag to X-address
// TODO: Take network into account (!)
const normalize = (id, type) => {
  if (type === 'transactions') {
    return id.toUpperCase();
  }
  if (type === 'accounts' && id.includes(':')) {
    // TODO: Test invalid classic address; "invalid" tag (?)
    const components = id.split(':');
    try {
      const xAddress = classicAddressToXAddress(
        components[0],
        components[1] === undefined || components[1] === 'false' ? false : components[1],
        false
      ); // TODO: Take network into account (!)
      return xAddress;
    } catch (_) {
      /* version_invalid: version bytes do not match any of the provided version(s) */
    }
  } else if (type === 'paystrings') {
    if (!isValidPayString(id)) {
      return id.replace('@', '$');
    }
  } else if (type === 'token') {
    const components = id.split('.');
    return `${components[0].toLowerCase()}.${components[1]}`;
  }
  return id;
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: '' };
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ redirect: '' });
  }

  handleSearch(id) {
    const { callback } = this.props;
    const type = getIdType(id);

    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'globalSearch',
      eventAction: type,
      eventLabel: id
    });

    this.setState(
      {
        redirect: type === 'invalid' ? `/search/${id}` : `/${type}/${normalize(id, type)}`
      },
      callback
    );
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSearch(event.currentTarget.value.trim());
    }
  }

  render() {
    const { t, mobile } = this.props;
    const { redirect } = this.state;
    return redirect ? (
      <Redirect push to={redirect} />
    ) : (
      <div className={mobile ? 'search' : 'search in-header'}>
        <input
          type="text"
          placeholder={t('header.search.placeholder')}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

Search.propTypes = {
  t: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  callback: PropTypes.func
};

Search.defaultProps = {
  mobile: false,
  callback: () => {}
};

export default translate()(Search);
