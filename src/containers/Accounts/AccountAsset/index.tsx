import { useState, useCallback } from 'react'
import './styles.scss'
import { useTranslation } from 'react-i18next'
import { localizeNumber } from '../../shared/utils'
import { useLanguage } from '../../shared/hooks'
import ArrowIcon from '../../shared/images/down_arrow.svg'
import { HeldIOUs } from './assetTables/HeldIOUs'
import { HeldMPTs } from './assetTables/HeldMPTs'
import { HeldLPTokens } from './assetTables/HeldLPTokens'
import { HeldNFTs } from './assetTables/HeldNFTs'
import { IssuedIOUs } from './assetTables/IssuedIOUs'
import { IssuedMPTs } from './assetTables/IssuedMPTs'
import { IssuedNFTs } from './assetTables/IssuedNFTs'

type HeldAssetTabKey = 'iou' | 'mpt' | 'lptoken' | 'nft'
type IssuedAssetTabKey = 'iou' | 'mpt' | 'nft'

function TabButton({
  label,
  active,
  onClick,
  loading = false,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  loading?: boolean
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
      {loading ? (
        <span>
          {label.replace(/\(\d+\)/, '')} (<span className="loading-spinner" />)
        </span>
      ) : (
        label
      )}
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
  const [counts, setCounts] = useState({
    heldIou: 0,
    heldMpt: 0,
    heldLptoken: 0,
    heldNft: 0,
    issuedIou: 0,
    issuedMpt: 0,
    issuedNft: 0,
  })

  // Loading states - start as true, set to false when we get data
  const [loading, setLoading] = useState({
    heldIou: true,
    heldMpt: true,
    heldLptoken: true,
    heldNft: true,
    issuedIou: true,
    issuedMpt: true,
    issuedNft: true,
  })

  // Stable update functions for each asset type
  const updateHeldIOUs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, heldIou: count }))
      setLoading((prev) => ({ ...prev, heldIou: isLoading }))
    },
    [],
  )

  const updateHeldMPTs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, heldMpt: count }))
      setLoading((prev) => ({ ...prev, heldMpt: isLoading }))
    },
    [],
  )

  const updateHeldLPTokens = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, heldLptoken: count }))
      setLoading((prev) => ({ ...prev, heldLptoken: isLoading }))
    },
    [],
  )

  const updateHeldNFTs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, heldNft: count }))
      setLoading((prev) => ({ ...prev, heldNft: isLoading }))
    },
    [],
  )

  const updateIssuedIOUs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, issuedIou: count }))
      setLoading((prev) => ({ ...prev, issuedIou: isLoading }))
    },
    [],
  )

  const updateIssuedMPTs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, issuedMpt: count }))
      setLoading((prev) => ({ ...prev, issuedMpt: isLoading }))
    },
    [],
  )

  const updateIssuedNFTs = useCallback(
    ({ count, isLoading }: { count: number; isLoading: boolean }) => {
      setCounts((prev) => ({ ...prev, issuedNft: count }))
      setLoading((prev) => ({ ...prev, issuedNft: isLoading }))
    },
    [],
  )

  // Tabs state
  const [heldTab, setHeldTab] = useState<HeldAssetTabKey>('iou')
  const [issuedTab, setIssuedTab] = useState<IssuedAssetTabKey>('iou')

  // Collapse state - default to expanded (true means open)
  const [heldSectionOpen, setHeldSectionOpen] = useState(true)
  const [issuedSectionOpen, setIssuedSectionOpen] = useState(true)

  return (
    <section className="account-asset">
      {/* Assets Held */}
      <div className="asset-section-header">
        <h3 className="account-asset-title">
          {t('account_page_asset_held_title')}
        </h3>
        <button
          type="button"
          className="asset-section-toggle"
          onClick={() => setHeldSectionOpen((s) => !s)}
          aria-expanded={heldSectionOpen}
          aria-label="Toggle assets held section"
        >
          <ArrowIcon
            className={`asset-section-arrow ${heldSectionOpen ? 'open' : ''}`}
          />
        </button>
      </div>
      <div
        className="account-asset-content"
        style={{ display: heldSectionOpen ? 'block' : 'none' }}
      >
        <div
          className="account-asset-tabs"
          role="tablist"
          aria-label="Assets Held Tabs"
        >
          <TabButton
            label={t('account_page_asset_tab_iou', {
              count: counts.heldIou,
            }).replace(
              counts.heldIou.toString(),
              localizeNumber(counts.heldIou, lang) || '0',
            )}
            active={heldTab === 'iou'}
            onClick={() => setHeldTab('iou')}
            loading={loading.heldIou}
          />
          <TabButton
            label={t('account_page_asset_tab_mpt', {
              count: counts.heldMpt,
            }).replace(
              counts.heldMpt.toString(),
              localizeNumber(counts.heldMpt, lang) || '0',
            )}
            active={heldTab === 'mpt'}
            onClick={() => setHeldTab('mpt')}
            loading={loading.heldMpt}
          />
          <TabButton
            label={t('account_page_asset_tab_lptoken', {
              count: counts.heldLptoken,
            }).replace(
              counts.heldLptoken.toString(),
              localizeNumber(counts.heldLptoken, lang) || '0',
            )}
            active={heldTab === 'lptoken'}
            onClick={() => setHeldTab('lptoken')}
            loading={loading.heldLptoken}
          />
          <TabButton
            label={t('account_page_asset_tab_nft', {
              count: counts.heldNft,
            }).replace(
              counts.heldNft.toString(),
              localizeNumber(counts.heldNft, lang) || '0',
            )}
            active={heldTab === 'nft'}
            onClick={() => setHeldTab('nft')}
            loading={loading.heldNft}
          />
        </div>

        {/* Render all components to fetch data, but only show active tab */}
        <div
          className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
          style={{ display: heldTab === 'iou' ? 'block' : 'none' }}
        >
          <HeldIOUs accountId={accountId} onChange={updateHeldIOUs} />
        </div>
        <div
          className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
          style={{ display: heldTab === 'mpt' ? 'block' : 'none' }}
        >
          <HeldMPTs accountId={accountId} onChange={updateHeldMPTs} />
        </div>
        <div
          className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
          style={{ display: heldTab === 'lptoken' ? 'block' : 'none' }}
        >
          <HeldLPTokens
            accountId={accountId}
            onChange={updateHeldLPTokens}
            xrpToUSDRate={xrpToUSDRate}
          />
        </div>
        <div
          className="account-asset-table-wrapper"
          style={{ display: heldTab === 'nft' ? 'block' : 'none' }}
        >
          <HeldNFTs accountId={accountId} onChange={updateHeldNFTs} />
        </div>
      </div>

      {/* Assets Issued */}
      <div className="asset-section-header">
        <h3 className="account-asset-title">
          {t('account_page_asset_issued_title')}
        </h3>
        <button
          type="button"
          className="asset-section-toggle"
          onClick={() => setIssuedSectionOpen((s) => !s)}
          aria-expanded={issuedSectionOpen}
          aria-label="Toggle assets issued section"
        >
          <ArrowIcon
            className={`asset-section-arrow ${issuedSectionOpen ? 'open' : ''}`}
          />
        </button>
      </div>
      <div
        className="account-asset-content"
        style={{ display: issuedSectionOpen ? 'block' : 'none' }}
      >
        <div
          className="account-asset-tabs"
          role="tablist"
          aria-label="Assets Issued Tabs"
        >
          <TabButton
            label={t('account_page_asset_tab_iou', {
              count: counts.issuedIou,
            }).replace(
              counts.issuedIou.toString(),
              localizeNumber(counts.issuedIou, lang) || '0',
            )}
            active={issuedTab === 'iou'}
            onClick={() => setIssuedTab('iou')}
            loading={loading.issuedIou}
          />
          <TabButton
            label={t('account_page_asset_tab_mpt', {
              count: counts.issuedMpt,
            }).replace(
              counts.issuedMpt.toString(),
              localizeNumber(counts.issuedMpt, lang) || '0',
            )}
            active={issuedTab === 'mpt'}
            onClick={() => setIssuedTab('mpt')}
            loading={loading.issuedMpt}
          />
          <TabButton
            label={t('account_page_asset_tab_nft', {
              count: counts.issuedNft,
            }).replace(
              counts.issuedNft.toString(),
              localizeNumber(counts.issuedNft, lang) || '0',
            )}
            active={issuedTab === 'nft'}
            onClick={() => setIssuedTab('nft')}
            loading={loading.issuedNft}
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
            onChange={updateIssuedIOUs}
          />
        </div>
        <div
          className="account-asset-table-wrapper account-asset-table-wrapper-fixed"
          style={{ display: issuedTab === 'mpt' ? 'block' : 'none' }}
        >
          <IssuedMPTs accountId={accountId} onChange={updateIssuedMPTs} />
        </div>
        <div
          className="account-asset-table-wrapper"
          style={{ display: issuedTab === 'nft' ? 'block' : 'none' }}
        >
          <IssuedNFTs accountId={accountId} onChange={updateIssuedNFTs} />
        </div>
      </div>
    </section>
  )
}
