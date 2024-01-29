import { ValidatorResponse } from '../../vhsTypes'

export interface VHSValidatorsHookResult {
  validators?: Record<string, ValidatorResponse>
  unl?: string[]
}
