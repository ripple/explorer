import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface DelegateSet extends TransactionCommonFields {
  Authorize: string
  Permissions: Permission[]
}

export interface Permission {
  Permission: {
    PermissionValue: string
  }
}
