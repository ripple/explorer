import React, { useState, useCallback } from 'react'
import './styles.scss'
import { useTranslation } from 'react-i18next'
import { HeldIOUs } from './assetTables/HeldIOUs'
import { HeldMPTs } from './assetTables/HeldMPTs'
import { HeldLPTokens } from './assetTables/HeldLPTokens'
import { HeldNFTs } from './assetTables/HeldNFTs'
import { IssuedIOUs } from './assetTables/IssuedIOUs'
import { IssuedMPTs } from './assetTables/IssuedMPTs'
import { IssuedNFTs } from './assetTables/IssuedNFTs'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'

type HeldAssetTabKey = 'iou' | 'mpt' | 'lptoken' | 'nft'
type IssuedAssetTabKey = 'iou' | 'mpt' | 'nft'

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={!!active}
      className={`account-asset-tab ${active ? 'is-active' : ''}`}
      onClick={onClick}
      title={label}
    >
      {label}
    </button>
  )
}

interface AccountAssetProps {
  accountId: string
  account?: any
  xrpToUSDRate: number
}

export default function AccountAsset({
  accountId,
  account,
  xrpToUSDRate,
}: AccountAssetProps) {
  const lang = useLanguage()
  const { t } = useTranslation()

  // Counts managed by individual table components
  const [heldCounts, setHeldCounts] = useState({
    iou: 0,
    mpt: 0,
    lptoken: 0,
    nft: 0,
  })

  const [issuedCounts, setIssuedCounts] = useState({
    iou: 0,
    mpt: 0,
    nft: 0,
  })

  // Functions to update counts (need useCallback for stable refs)
  const updateHeldCount = useCallback(
    (type: keyof typeof heldCounts, count: number) => {
      setHeldCounts((prev) => ({ ...prev, [type]: count }))
    },
    [],
  )
  const updateIssuedCount = useCallback(
    (type: keyof typeof issuedCounts, count: number) => {
      setIssuedCounts((prev) => ({ ...prev, [type]: count }))
    },
    [],
  )

  // Specific update functions for each type (need useCallback for stable refs)
  const updateHeldIOUCount = useCallback(
    (count: number) => updateHeldCount('iou', count),
    [updateHeldCount],
  )
  const updateHeldMPTokenCount = useCallback(
    (count: number) => updateHeldCount('mpt', count),
    [updateHeldCount],
  )
  const updateHeldLPTokenCount = useCallback(
    (count: number) => updateHeldCount('lptoken', count),
    [updateHeldCount],
  )
  const updateHeldNFTCount = useCallback(
    (count: number) => updateHeldCount('nft', count),
    [updateHeldCount],
  )

  const updateIssuedIOUCount = useCallback(
    (count: number) => updateIssuedCount('iou', count),
    [updateIssuedCount],
  )
  const updateIssuedMPTokenCount = useCallback(
    (count: number) => updateIssuedCount('mpt', count),
    [updateIssuedCount],
  )
  const updateIssuedNFTCount = useCallback(
    (count: number) => updateIssuedCount('nft', count),
    [updateIssuedCount],
  )

  // Tabs state
  const [heldTab, setHeldTab] = useState<HeldAssetTabKey>('iou')
  const [issuedTab, setIssuedTab] = useState<IssuedAssetTabKey>('iou')

  return (
    <section className="account-asset">
      {/* Assets Held */}
      <h3 className="account-asset-title">
        {t('account_page_asset_held_title')}
      </h3>
      <div
        className="account-asset-tabs"
        role="tablist"
        aria-label="Assets Held Tabs"
      >
        <TabButton
          label={t('account_page_asset_tab_iou', {
            count: localizeNumber(heldCounts.iou, lang),
          })}
          active={heldTab === 'iou'}
          onClick={() => setHeldTab('iou')}
        />
        <TabButton
          label={t('account_page_asset_tab_mpt', {
            count: localizeNumber(heldCounts.mpt, lang),
          })}
          active={heldTab === 'mpt'}
          onClick={() => setHeldTab('mpt')}
        />
        <TabButton
          label={t('account_page_asset_tab_lptoken', {
            count: localizeNumber(heldCounts.lptoken, lang),
          })}
          active={heldTab === 'lptoken'}
          onClick={() => setHeldTab('lptoken')}
        />
        <TabButton
          label={t('account_page_asset_tab_nft', {
            count: localizeNumber(heldCounts.nft, lang),
          })}
          active={heldTab === 'nft'}
          onClick={() => setHeldTab('nft')}
        />
      </div>

      {/* Render all components to fetch data, but only show active tab */}
      <div
        className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
        style={{ display: heldTab === 'iou' ? 'block' : 'none' }}
      >
        <HeldIOUs
          accountId={accountId}
          xrpToUSDRate={xrpToUSDRate}
          onCountChange={updateHeldIOUCount}
        />
      </div>
      <div
        className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
        style={{ display: heldTab === 'mpt' ? 'block' : 'none' }}
      >
        <HeldMPTs
          accountId={accountId}
          onCountChange={updateHeldMPTokenCount}
        />
      </div>
      <div
        className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
        style={{ display: heldTab === 'lptoken' ? 'block' : 'none' }}
      >
        <HeldLPTokens
          accountId={accountId}
          onCountChange={updateHeldLPTokenCount}
          xrpToUSDRate={xrpToUSDRate}
        />
      </div>
      <div
        className="account-asset-table-wrapper"
        style={{ display: heldTab === 'nft' ? 'block' : 'none' }}
      >
        <HeldNFTs accountId={accountId} onCountChange={updateHeldNFTCount} />
      </div>

      {/* Assets Issued */}
      <h3 className="account-asset-title">
        {t('account_page_asset_issued_title')}
      </h3>
      <div
        className="account-asset-tabs"
        role="tablist"
        aria-label="Assets Issued Tabs"
      >
        <TabButton
          label={t('account_page_asset_tab_iou', {
            count: localizeNumber(issuedCounts.iou, lang),
          })}
          active={issuedTab === 'iou'}
          onClick={() => setIssuedTab('iou')}
        />
        <TabButton
          label={t('account_page_asset_tab_mpt', {
            count: localizeNumber(issuedCounts.mpt, lang),
          })}
          active={issuedTab === 'mpt'}
          onClick={() => setIssuedTab('mpt')}
        />
        <TabButton
          label={t('account_page_asset_tab_nft', {
            count: localizeNumber(issuedCounts.nft, lang),
          })}
          active={issuedTab === 'nft'}
          onClick={() => setIssuedTab('nft')}
        />
      </div>

      {/* Render all components to fetch data, but only show active tab */}
      <div
        className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
        style={{ display: issuedTab === 'iou' ? 'block' : 'none' }}
      >
        <IssuedIOUs
          accountId={accountId}
          account={account}
          xrpToUSDRate={xrpToUSDRate}
          onCountChange={updateIssuedIOUCount}
        />
      </div>
      <div
        className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
        style={{ display: issuedTab === 'mpt' ? 'block' : 'none' }}
      >
        <IssuedMPTs
          accountId={accountId}
          onCountChange={updateIssuedMPTokenCount}
        />
      </div>
      <div
        className="account-asset-table-wrapper"
        style={{ display: issuedTab === 'nft' ? 'block' : 'none' }}
      >
        <IssuedNFTs
          accountId={accountId}
          onCountChange={updateIssuedNFTCount}
        />
      </div>
    </section>
  )
}
