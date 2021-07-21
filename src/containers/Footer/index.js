import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import { updateLanguage } from '../App/actions';
import packageConfig from '../../../package.json';
import { ReactComponent as Logo } from '../shared/images/XRPLedger.svg';
import iconDownArrow from '../shared/images/down_arrow.svg';
import iconCheck from '../shared/images/checkmark_small_green.png';
import flagUSA from '../shared/images/flag_usa.png';
import flagChina from '../shared/images/flag_china.png';
import flagJapan from '../shared/images/flag_japan.png';
import flagKorea from '../shared/images/flag_korea.png';
import flagBrazil from '../shared/images/flag_brazil.png';
import flagMexico from '../shared/images/flag_mexico.png';
import './footer.css';

const LANGUAGES = {
  'en-US': { title: 'English', flag: flagUSA, code: 'en-US' },
  'zh-Hans': { title: '中文', flag: flagChina, code: 'zh-Hans' },
  'ja-JP': { title: '日本語', flag: flagJapan, code: 'ja-JP' },
  'ko-KP': { title: '한국어', flag: flagKorea, code: 'ko-KP' },
  'es-MX': { title: 'Español', flag: flagMexico, code: 'es-MX' },
  'pt-BR': { title: 'Português', flag: flagBrazil, code: 'pt-BR' },
};

const ORDER = ['en-US', 'zh-Hans', 'ja-JP', 'ko-KP', 'es-MX', 'pt-BR'];

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLangOpen: false,
    };
    this.languageEvents = this.languageEvents.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(event) {
    const { i18n, language, actions } = this.props;
    event.preventDefault();
    event.stopPropagation();
    const code = event.currentTarget.getAttribute('data-code');
    const { key, type } = event;
    if (type === 'click' || (type === 'keydown' && key === 'Enter')) {
      if (language !== code) {
        analytics(ANALYTIC_TYPES.event, {
          eventCategory: 'LanguageSelector',
          eventAction: 'changeLanguage',
          eventLabel: code,
        });
        i18n.changeLanguage(code);
        actions.updateLanguage(code);
      }
    }
    this.setState(prevState => ({ isLangOpen: !prevState.isLangOpen }));
  }

  languageEvents(event) {
    event.preventDefault();
    event.stopPropagation();
    const { key, type } = event;
    this.setState(prevState => {
      const newState = { isLangOpen: !prevState.isLangOpen };
      if (type === 'mouseleave') {
        newState.isLangOpen = false;
      } else if (key === 'Tab' && type === 'keyup') {
        newState.isLangOpen = true;
      }
      return newState;
    });
  }

  languageItem(config) {
    const { isLangOpen } = this.state;
    const { language } = this.props;
    const { changeLanguage } = this;
    let icon;
    let className = 'language-item';
    if (isLangOpen && language === config.code) {
      icon = <img src={iconCheck} alt="" className="check" />;
      className += ' selected';
    } else if (!isLangOpen) {
      icon = <img src={iconDownArrow} alt="" className="down" />;
      className = 'language-item-collapsed';
    }
    return (
      <div
        className={className}
        data-code={config.code}
        key={config.code}
        onClick={changeLanguage}
        onKeyDown={changeLanguage}
        role="menuitem"
        tabIndex="0"
      >
        <img src={config.flag} alt={`${config.title} flag`} className="flag" />
        <div className="title">{config.title}</div>
        {icon}
      </div>
    );
  }

  renderLanguage() {
    const { isLangOpen } = this.state;
    const { language } = this.props;
    const handleEvents = this.languageEvents;
    let items;
    let className = 'language';
    if (isLangOpen) {
      items = ORDER.map(code => this.languageItem(LANGUAGES[code]));
      className += ' open';
    } else {
      items = this.languageItem(LANGUAGES[language]);
    }

    return (
      <div className="language-container">
        <div
          className={className}
          onClick={handleEvents}
          onKeyUp={handleEvents}
          onMouseLeave={handleEvents}
          role="menubar"
          tabIndex="0"
        >
          {items}
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <div className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-link-section">
              <div className="footer-section-header">Learn</div>
              <a href="https://xrpl.org/overview.html" className="footer-link">
                Overview
              </a>
              <a href="https://xrpl.org/uses.html" className="footer-link">
                Uses
              </a>
              <a href="https://xrpl.org/history.html" className="footer-link">
                History
              </a>
              <a href="https://xrpl.org/impact.html" className="footer-link">
                Impact
              </a>
              <a href="https://xrpl.org/carbon-calculator.html" className="footer-link">
                Carbon Calculator
              </a>
            </div>

            <div className="footer-link-section">
              <div className="footer-section-header">Explore</div>
              <a href="https://xrpl.org/index.html" className="footer-link">
                News
              </a>
              <a href="https://xrpl.org/wallet.html" className="footer-link">
                Wallets
              </a>
              <a href="https://xrpl.org/exchanges.html" className="footer-link">
                Exchanges
              </a>
              <a href="https://xrpl.org/businesses.html" className="footer-link">
                XRPL Businesses
              </a>
              <a href="https://livenet.xrpl.org/" className="footer-link">
                Ledger Explorer
              </a>
            </div>

            <div className="footer-link-section">
              <div className="footer-section-header">Build</div>
              <a href="https://xrpl.org/get-started.html" className="footer-link">
                Get Started
              </a>
              <a href="https://xrpl.org/docs.html" className="footer-link">
                Docs
              </a>
              <a href="https://xrpl.org/dev-tools.html" className="footer-link">
                Tools
              </a>
              <a href="https://xrpl.org/blog/" className="footer-link">
                Dev Blog
              </a>
            </div>

            <div className="footer-link-section">
              <div className="footer-section-header">Contribute</div>
              <a href="https://xrpl.org/contribute.html" className="footer-link">
                How to Contribute
              </a>
              <a href="https://github.com/ripple/xrpl-dev-portal" className="footer-link">
                XRPL on GitHub
              </a>
            </div>
          </div>
          <div className="footer-branding">
            <div className="logo">
              <Logo alt={t('xrpl_explorer')} />
              <div>
                {t('explorer')}
                <span className="version"> {t('version', { number: packageConfig.version })}</span>
              </div>
            </div>
            {this.renderLanguage()}
            <div className="copyright">
              <b>© </b>
              <a target="_blank" rel="noopener noreferrer" href="https://xrpl.org">
                XRP Ledger Project
              </a>
              <span> 2012-2021</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    updateLanguage: PropTypes.func,
  }).isRequired,
};

export default connect(
  state => ({
    language: state.app.language,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        updateLanguage,
      },
      dispatch
    ),
  })
)(translate()(Footer));
