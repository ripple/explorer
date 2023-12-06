import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import SuccessIcon from '../shared/images/success.svg'
import { LedgerValidation } from './LedgerValidation'
import { LedgerHash } from '../shared/useStreams'
import { LedgerUNLCount } from './LedgerUNLCount'
import { ValidatorResponse } from '../shared/vhsTypes'

function areEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.hash.hash === nextProps.hash.hash &&
    prevProps.hash.validations.length === nextProps.hash.validations.length &&
    prevProps.hash.validated === nextProps.hash.validated
  )
}
export const LedgerHashComponent = memo(
  ({
    hash,
    unlCount,
    unlValidators,
    vhsData,
  }: {
    hash: LedgerHash
    unlCount: number
    unlValidators: any[]
    vhsData: ValidatorResponse[]
  }) => {
    const { t } = useTranslation()
    const shortHash = hash.hash.substr(0, 6)
    const barStyle = { background: `#${shortHash}` }
    const validated = hash.validated && <SuccessIcon className="validated" />
    const unlValidatorKeys = unlValidators.map(
      (validator) => validator.signing_key,
    )

    const getMissingValidators = () => {
      const unlValidations = hash.validations
        .map((validation) => validation.validation_public_key)
        .filter((pubkey) => unlValidatorKeys.includes(pubkey))
      const missing = unlValidators.filter(
        (validator) => !unlValidations.includes(validator.signing_key),
      )
      return missing
    }

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
            trustedCount={
              hash.validations.filter((validation) =>
                unlValidatorKeys.includes(validation.validation_public_key),
              ).length
            }
            missing={getMissingValidators()}
          />
        </div>
        <div className="validations">
          {hash.validations.map((validation) => (
            <LedgerValidation
              validation={validation}
              isTrusted={unlValidatorKeys.includes(
                validation.validation_public_key,
              )}
              key={`${validation.validation_public_key}-${validation.cookie}`}
              vhsData={
                vhsData.filter(
                  (vhsValidator) =>
                    vhsValidator.signing_key ===
                    validation.validation_public_key,
                )[0]
              }
              time={hash.time}
            />
          ))}
        </div>
      </div>
    )
  },
  areEqual,
)
