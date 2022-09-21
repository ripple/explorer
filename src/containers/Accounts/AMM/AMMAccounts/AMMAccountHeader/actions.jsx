import { getAMMInfo } from 'rippled/lib/rippled'
import { analytics, ANALYTIC_TYPES, BAD_REQUEST } from 'containers/shared/utils'

const loadAMMAccountInfo = (ammID, rippledSocket) =>
  getAMMInfo(rippledSocket, ammID)
    .then((data) => data)
    .catch((error) => {
      const status = error.code
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `getAMMInfo ${ammID} --- ${JSON.stringify(error)}`,
      })
    })

export { loadAMMAccountInfo }
