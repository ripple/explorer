import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import NetworkTabs from './NetworkTabs'
import ValidatorsTable from './ValidatorsTable'
import { localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import { Hexagons } from './Hexagons'
import { StreamValidator } from '../shared/vhsTypes'
import { TooltipProvider } from '../shared/components/Tooltip'
import { useStreams } from '../shared/components/Streams/StreamsContext'
import { useVHSValidators } from '../shared/components/VHSValidators/VHSValidatorsContext'

export const Validators = () => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { validators: validatorsFromValidations, metrics } = useStreams()
  const { validators: validatorsFromVHS, unl } = useVHSValidators()

  const merged = useMemo(() => {
    if (
      !validatorsFromVHS ||
      !(
        validatorsFromValidations &&
        Object.keys(validatorsFromValidations).length
      )
    ) {
      return
    }
    const updated: Record<string, StreamValidator> = {}
    const keys = new Set(
      Object.keys(validatorsFromVHS).concat(
        Object.keys(validatorsFromValidations),
      ),
    )
    keys.forEach((d: string) => {
      const newData: StreamValidator =
        validatorsFromVHS[d] || validatorsFromValidations[d]
      if (
        newData.ledger_index == null &&
        validatorsFromValidations[d] &&
        validatorsFromValidations[d].ledger_index
      ) {
        // VHS uses `current_index` instead of `ledger_index`
        // If `ledger_index` isn't defined, then we're still using the VHS data,
        // instead of the Streams data
        newData.ledger_index = validatorsFromValidations[d].ledger_index
      }
      if (newData.current_index == null) {
        newData.signing_key = validatorsFromValidations[d].pubkey
      }
      // latest hash and time comes from the validations stream
      if (validatorsFromValidations[d]) {
        newData.time = validatorsFromValidations[d].time
        newData.ledger_hash = validatorsFromValidations[d].ledger_hash
      }

      updated[d] = newData
    })
    return Object.values(updated)
  }, [validatorsFromVHS, validatorsFromValidations])

  const validatorCount = useMemo(
    () => merged && Object.keys(merged).length,
    [merged],
  )

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <TooltipProvider>
          <Hexagons data={validatorsFromValidations} list={validatorsFromVHS} />
        </TooltipProvider>
      }
      <div className="stat">
        <span>{t('validators_found')}: </span>
        <span>
          {localizeNumber(validatorCount, language)}
          {unl?.length !== 0 && (
            <i>
              {' '}
              ({t('unl')}: {unl?.length})
            </i>
          )}
        </span>
      </div>
      <div className="wrap">
        <NetworkTabs selected="validators" />
        <ValidatorsTable validators={merged} metrics={metrics} />
      </div>
    </div>
  )
}
