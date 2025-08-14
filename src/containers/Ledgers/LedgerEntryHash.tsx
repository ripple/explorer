import { useTranslation } from 'react-i18next'
import SuccessIcon from '../shared/images/success.svg'
import { LedgerEntryValidator } from './LedgerEntryValidator'
import { LedgerEntryHashTrustedCount } from './LedgerEntryHashTrustedCount'
import { LedgerHash } from '../shared/components/Streams/types'

export const LedgerEntryHash = ({ hash }: { hash: LedgerHash }) => {
  const { t } = useTranslation()
  const shortHash = hash.hash.substring(0, 6)
  const barStyle = { background: `#${shortHash}` }
  const validated = hash.validated && <SuccessIcon className="validated" />
  return (
    <div className={`hash ${hash.unselected ? 'unselected' : ''}`}>
      <div className="bar" style={barStyle} />
      <div className="ledger-hash">
        <div className="hash-concat">{hash.hash.substring(0, 6)}</div>
        {validated}
      </div>
      <div className="subtitle">
        <div className="validation-total">
          <div>{t('total')}:</div>
          <b>{hash.validations.length}</b>
        </div>
        <LedgerEntryHashTrustedCount validations={hash.validations} />
      </div>
      <div className="validations">
        {hash.validations.map((validation, i) => (
          <LedgerEntryValidator
            validation={validation}
            index={i}
            key={validation.cookie}
          />
        ))}
      </div>
    </div>
  )
}
