import { useTranslation } from 'react-i18next'
import SuccessIcon from '../shared/images/success.svg'
import { LedgerEntryValidator } from './LedgerEntryValidator'
import { LedgerEntryHashTrustedCount } from './LedgerEntryHashTrustedCount'
import { ValidatorResponse } from './types'

export const LedgerEntryHash = ({
  hash,
  unlCount,
  validators,
}: {
  hash: any
  unlCount?: number
  validators: { [pubkey: string]: ValidatorResponse }
}) => {
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
        <LedgerEntryHashTrustedCount
          hash={hash}
          unlCount={unlCount}
          validators={validators}
        />
      </div>
      <div className="validations">
        {hash.validations.map((validation, i) => (
          <LedgerEntryValidator
            validators={validators}
            validator={validation}
            index={i}
            key={validation.cookie}
          />
        ))}
      </div>
    </div>
  )
}
