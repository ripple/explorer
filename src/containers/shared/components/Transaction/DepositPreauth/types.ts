export interface DepositPreauthWithAuthorize {
  Authorize: string
  Unauthorize: never
}

export interface DepositPreauthWithUnauthorize {
  Authorize: never
  Unauthorize: string
}

export type DepositPreauth =
  | DepositPreauthWithAuthorize
  | DepositPreauthWithUnauthorize
