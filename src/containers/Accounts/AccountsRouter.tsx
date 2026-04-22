import { useContext } from 'react'
import { Navigate, useParams } from 'react-router'
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
import { getDeletedAMMData } from '../AMMPool/utils'

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

  const { data: comp, error } = useQuery([accountId], async () => {
    let classicAddress = accountId
    if (isValidXAddress(accountId)) {
      classicAddress = xAddressToClassicAddress(accountId).classicAddress
    }

    if (!isValidClassicAddress(classicAddress)) {
      throw new Error('account malformed', BAD_REQUEST)
    }

    try {
      const data = await getAccountInfo(rippledSocket, classicAddress)

      if (data.AMMID) {
        return (
          <Navigate
            to={buildPath(AMM_POOL_ROUTE, { id: classicAddress })}
            replace
          />
        )
      }

      return <Accounts />
    } catch (responseError: any) {
      // Even if account info fails it might be a deleted account or deleted AMM
      if (responseError?.code === 404) {
        try {
          const deletedAmm = await getDeletedAMMData(
            rippledSocket,
            classicAddress,
          )

          if (deletedAmm) {
            return (
              <Navigate
                to={buildPath(AMM_POOL_ROUTE, { id: classicAddress })}
                replace
              />
            )
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to check for deleted AMM pool:', e)
        }

        return <Accounts />
      }

      throw responseError
    }
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
