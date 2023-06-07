import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { AccountIssuedTokenTable } from '../AccountIssuedTokenTable'
import { AccountNFTTable } from '../AccountNFTTable/AccountNFTTable'

// TODO: Add state types or convert to react query
interface Props {
  account: any
}

function AccountAssetTabDisconnected({ account }: Props) {
  const assetTypes = ['issued', 'nft']
  const { id: accountId, assetType = assetTypes[0] } = useParams<{
    id: string
    assetType: string
  }>()
  const history = useHistory()
  const { t } = useTranslation()
  function switchAsset(event: ChangeEvent<HTMLInputElement>) {
    return history.push(`/accounts/${accountId}/assets/${event.target.value}`)
  }
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
      </div>
    </>
  )
}

export const AccountAssetTab = connect((state: any) => ({
  account: state.accountHeader.data,
}))(AccountAssetTabDisconnected)
