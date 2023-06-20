import { useContext } from 'react'
import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { isValidXAddress, xAddressToClassicAddress } from 'ripple-address-codec'
import { AMMAccounts } from './AMM/AMMAccounts'
import SocketContext from '../shared/SocketContext'
import { getAccountInfo } from '../../rippled/lib/rippled'
import NoMatch from '../NoMatch'
import { Accounts } from './index'
import { ERROR_MESSAGES } from './Errors'
import { Loader } from '../shared/components/Loader'
import { ACCOUNT_FLAGS } from '../../rippled/lib/utils'

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
  const { id: accountId } = useParams<{ id: string }>()
  const rippledSocket = useContext(SocketContext)
  const flags: any = Object.entries(ACCOUNT_FLAGS).reduce(
    (all, [key, value]) => ({ ...all, [value]: key }),
    {},
  )

  const { data: comp, error } = useQuery([accountId], () => {
    let classicAddress = accountId
    if (isValidXAddress(accountId)) {
      classicAddress = xAddressToClassicAddress(accountId).classicAddress
    }

    return (
      getAccountInfo(rippledSocket, classicAddress)
        .then((data: any) => {
          if (data.Flags & flags.lsfAMM) {
            return <AMMAccounts />
          }
          return <Accounts />
        })
        // Even if account info fails it might be a deleted account
        .catch(() => <Accounts />)
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
