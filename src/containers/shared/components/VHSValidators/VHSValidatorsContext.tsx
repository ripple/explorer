import { contextFactory } from '../../../helpers/contextFactory'
import { VHSValidatorsHookResult } from './types'

const [VHSValidatorsContext, useVHSValidators] =
  contextFactory<VHSValidatorsHookResult>({
    hook: 'useVHSValidators',
    provider: 'VHSValidatorsProvider',
  })

export { VHSValidatorsContext, useVHSValidators }
