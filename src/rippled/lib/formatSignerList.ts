import { SignerListSet } from '../../containers/shared/components/Transaction/SignerListSet/types'

export const formatSignerList = (data: SignerListSet) => ({
  quorum: data.SignerQuorum,
  maxSigners: data.SignerEntries
    ? data.SignerEntries.reduce(
        (total, d) => total + d.SignerEntry.SignerWeight,
        0,
      )
    : 0,
  signers: data.SignerEntries
    ? data.SignerEntries.map((d) => ({
        account: d.SignerEntry.Account,
        weight: d.SignerEntry.SignerWeight,
      }))
    : [],
})
