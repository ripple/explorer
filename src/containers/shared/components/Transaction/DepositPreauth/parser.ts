import { CredentialAuth, DepositPreauth } from './types'

// Transform the nested XRPL credential structure to flat CredentialAuth objects
const transformCredentials = (credentials: any[]): CredentialAuth[] =>
  credentials.map((item) => {
    // Check if it's nested (has Credential wrapper) or already flat
    if (item.Credential) {
      return {
        Issuer: item.Credential.Issuer,
        CredentialType: item.Credential.CredentialType,
      }
    }
    // Already flat, return as-is
    return {
      Issuer: item.Issuer,
      CredentialType: item.CredentialType,
    }
  })

export const parser = (tx: any): DepositPreauth => {
  // Handle AuthorizeCredentials (both nested and flat structures)
  if (tx.AuthorizeCredentials) {
    const { Authorize, Unauthorize, ...rest } = tx
    const result = {
      ...rest,
      AuthorizeCredentials: transformCredentials(tx.AuthorizeCredentials),
    } as DepositPreauth
    return result
  }

  // Handle UnauthorizeCredentials (both nested and flat structures)
  if (tx.UnauthorizeCredentials) {
    const { Authorize, Unauthorize, ...rest } = tx
    const result = {
      ...rest,
      UnauthorizeCredentials: transformCredentials(tx.UnauthorizeCredentials),
    } as DepositPreauth
    return result
  }

  // For Authorize/Unauthorize fields (string-based), pass through unchanged
  return tx as DepositPreauth
}
