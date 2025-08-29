import { CredentialAuth, DepositPreauth } from './types'

// Transform the nested XRPL credential structure to flat CredentialAuth objects
const transformCredentials = (credentials: any[]): CredentialAuth[] => {
  return credentials.map((item) => ({
    Issuer: item.Credential.Issuer,
    CredentialType: item.Credential.CredentialType,
  }))
}

export const parser = (tx: any): DepositPreauth => {
  // Handle AuthorizeCredentials with nested structure
  if (tx.AuthorizeCredentials) {
    return {
      ...tx,
      AuthorizeCredentials: transformCredentials(tx.AuthorizeCredentials),
    } as DepositPreauth
  }

  // Handle UnauthorizeCredentials with nested structure
  if (tx.UnauthorizeCredentials) {
    return {
      ...tx,
      UnauthorizeCredentials: transformCredentials(tx.UnauthorizeCredentials),
    } as DepositPreauth
  }

  // For Authorize/Unauthorize fields (string-based), pass through unchanged
  return tx as DepositPreauth
}