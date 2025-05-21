import { TransactionCommonFields } from '../types'

export interface DelegateSet extends TransactionCommonFields {
  Authorize: string
  Permissions: Permission[]
}

export interface Permission {
  Permission: {
    PermissionValue: string
  }
}
