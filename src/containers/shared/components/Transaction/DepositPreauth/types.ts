// Credential authorization object as per XLS-70 spec
export interface CredentialAuth {
  Issuer: string
  CredentialType: string
}

export interface DepositPreauthWithAuthorize {
  Authorize: string
  Unauthorize: never
  AuthorizeCredentials: never
  UnauthorizeCredentials: never
}

export interface DepositPreauthWithUnauthorize {
  Authorize: never
  Unauthorize: string
  AuthorizeCredentials: never
  UnauthorizeCredentials: never
}

export interface DepositPreauthWithAuthorizeCredentials {
  Authorize: never
  Unauthorize: never
  AuthorizeCredentials: CredentialAuth[]
  UnauthorizeCredentials: never
}

export interface DepositPreauthWithUnauthorizeCredentials {
  Authorize: never
  Unauthorize: never
  AuthorizeCredentials: never
  UnauthorizeCredentials: CredentialAuth[]
}

export type DepositPreauth =
  | DepositPreauthWithAuthorize
  | DepositPreauthWithUnauthorize
  | DepositPreauthWithAuthorizeCredentials
  | DepositPreauthWithUnauthorizeCredentials
