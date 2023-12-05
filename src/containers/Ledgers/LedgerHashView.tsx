import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import SuccessIcon from '../shared/images/success.svg'
import { LedgerValidation } from './LedgerValidation'
import { LedgerHash } from '../shared/useStreams'
import { LedgerUNLCount } from './LedgerUNLCount'

function areEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.hash.hash === nextProps.hash.hash &&
    prevProps.hash.validations.length === nextProps.hash.validations.length &&
    prevProps.hash.validated === nextProps.hash.validated
  )
}
export const LedgerHashComponent = memo(
  ({ hash, unlCount }: { hash: LedgerHash; unlCount: number }) => {
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
          <div className="hash-concat">{shortHash}</div>
          {validated}
        </div>
        <div className="subtitle">
          <div className="validation-total">
            <div>{t('total')}:</div>
            <b>{hash.validations.length}</b>
          </div>
          <LedgerUNLCount
            unlCount={unlCount}
            trustedCount={hash.trusted_count}
          />
        </div>
        <div className="validations">
          {hash.validations.map((validation) => (
            <LedgerValidation
              validation={validation}
              key={`${validation.validation_public_key}-${validation.cookie}`}
            />
          ))}
        </div>
      </div>
    )
  },
  areEqual,
)
