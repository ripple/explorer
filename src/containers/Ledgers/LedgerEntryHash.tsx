import { useTranslation } from 'react-i18next'
import SuccessIcon from '../shared/images/success.svg'
import { LedgerEntryValidator } from './LedgerEntryValidator'
import { LedgerEntryHashTrustedCount } from './LedgerEntryHashTrustedCount'

export const LedgerEntryHash = ({ hash }: { hash: any }) => {
  const { t } = useTranslation()
  const shortHash = hash.hash.substr(0, 6)
  const barStyle = { background: `#${shortHash}` }
  const validated = hash.validated && <SuccessIcon className="validated" />
  return (
    <div
      className={`hash ${hash.unselected ? 'unselected' : ''}`}
      key={hash.hash}
    >
      <div className="bar" style={barStyle} />
      <div className="ledger-hash">
        <div className="hash-concat">{hash.hash.substr(0, 6)}</div>
        {validated}
      </div>
      <div className="subtitle">
        <div className="validation-total">
          <div>{t('total')}:</div>
          <b>{hash.validations.length}</b>
        </div>
        <LedgerEntryHashTrustedCount hash={hash} />
      </div>
      <div className="validations">
        {hash.validations.map((validation, i) => (
          <LedgerEntryValidator
            validator={validation}
            index={i}
            key={validation.cookie}
          />
        ))}
      </div>
    </div>
  )
}
