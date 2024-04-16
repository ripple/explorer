import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router'
import { useRouteParams } from '../../shared/routing'
import { AccountIssuedTokenTable } from '../AccountIssuedTokenTable'
import { AccountNFTTable } from '../AccountNFTTable/AccountNFTTable'
import { AccountMPTTable } from '../AccountMPTTable/AccountMPTTable'
import { ACCOUNT_ROUTE } from '../../App/routes'

// TODO: Add state types or convert to react query
interface Props {
  account: any
}

const assetTypes = ['issued', 'nft', 'mpt']

const AccountAssetTabDisconnected = ({ account }: Props) => {
  const { id: accountId = '', assetType = assetTypes[0] } =
    useRouteParams(ACCOUNT_ROUTE)
  const navigate = useNavigate()
  const { t } = useTranslation()
  function switchAsset(event: ChangeEvent<HTMLInputElement>) {
    return navigate(`/accounts/${accountId}/assets/${event.target.value}`)
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (account.deleted) return <></>
  return (
    <>
      <div className="radio-group">
        {assetTypes.map((type) => {
          const fieldId = `tokens-${type}`
          return (
            <label
              className={assetType === type ? 'selected' : ''}
              htmlFor={fieldId}
              key={type}
            >
              <input
                type="radio"
                id={fieldId}
                name="assetType"
                value={type}
                checked={assetType === type}
                onChange={switchAsset}
              />{' '}
              {t(`assets.${type}_tab_title` as any)}
            </label>
          )
        })}
      </div>
      <div className="tab-body">
        {assetType === 'issued' && (
          <AccountIssuedTokenTable account={account} />
        )}
        {assetType === 'nft' && <AccountNFTTable accountId={accountId} />}
        {assetType === 'mpt' && <AccountMPTTable accountId={accountId} />}
      </div>
    </>
  )
}

export const AccountAssetTab = connect((state: any) => ({
  account: state.accountHeader.data,
}))(AccountAssetTabDisconnected)
