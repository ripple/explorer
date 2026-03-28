import { useContext } from 'react'
import { useParams } from 'react-router'
import { Navigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'
import SocketContext from '../shared/SocketContext'
import { getAccountInfo } from '../../rippled/lib/rippled'
import NoMatch from '../NoMatch'
import { Accounts } from './index'
import { ERROR_MESSAGES } from './Errors'
import { Loader } from '../shared/components/Loader'
import { Error } from '../../rippled/lib/utils'
import { BAD_REQUEST } from '../shared/utils'
import { buildPath } from '../shared/routing'
import { AMM_POOL_ROUTE } from '../App/routes'
import { detectLiquidatedAMM } from '../AMMPool/utils'

const getErrorMessage = (error: any) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

function renderError(error: any) {
  const message = getErrorMessage(error.code)
  return (
    <div className="accounts-page">
      <NoMatch title={message.title} hints={message.hints} />
    </div>
  )
}

export const AccountsRouter = () => {
  const { id: accountId = '' } = useParams<{ id: string }>()
  const rippledSocket = useContext(SocketContext)

  const { data: comp, error } = useQuery([accountId], () => {
    let classicAddress = accountId
    if (isValidXAddress(accountId)) {
      classicAddress = xAddressToClassicAddress(accountId).classicAddress
    }

    if (!isValidClassicAddress(classicAddress)) {
      return Promise.reject(new Error('account malformed', BAD_REQUEST))
    }

    return (
      getAccountInfo(rippledSocket, classicAddress)
        .then((data: any) => {
          if (data.AMMID) {
            return (
              <Navigate
                to={buildPath(AMM_POOL_ROUTE, { id: classicAddress })}
                replace
              />
            )
          }

          return <Accounts />
        })
        // Even if account info fails it might be a deleted account or liquidated AMM
        .catch(async (responseError: Error) => {
          if (responseError?.code === 404) {
            // Check if this is a liquidated AMM pool
            const liquidatedAmm = await detectLiquidatedAMM(
              rippledSocket,
              classicAddress,
            )
            if (liquidatedAmm) {
              return (
                <Navigate
                  to={buildPath(AMM_POOL_ROUTE, { id: classicAddress })}
                  replace
                />
              )
            }
            return <Accounts />
          }

          return Promise.reject(responseError)
        })
    )
  })

  if (!accountId) {
    return (
      <NoMatch
        title="account_empty_title"
        hints={['account_empty_hint']}
        isError={false}
      />
    )
  }
  if (error) {
    return renderError(error)
  }

  return comp || <Loader />
}
