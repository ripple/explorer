import { useTranslation } from 'react-i18next'

import packageConfig from '../../../package.json'
import Logo from '../shared/images/XRPLedger.svg'
import './footer.scss'

const Footer = (props) => {
  const { t } = useTranslation()

  return (
    <div className="footer">
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
          <a
            href="https://xrpl.org/carbon-calculator.html"
            className="footer-link"
          >
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
          <a
            href="https://github.com/ripple/xrpl-dev-portal"
            className="footer-link"
          >
            XRPL on GitHub
          </a>
        </div>
      </div>
      <div className="footer-branding">
        <div className="logo">
          <Logo className="image" alt={t('xrpl_explorer')} />
          <span className="text">
            {t('explorer')}
            <span className="version">
              {' '}
              {t('version', { number: packageConfig.version })}
            </span>
          </span>
        </div>
        <div className="copyright">
          <span>&#169;&nbsp;</span>
          <a
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://xrpl.org"
          >
            XRP Ledger Project
          </a>
          <span>&nbsp;2012-{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}

export default Footer
