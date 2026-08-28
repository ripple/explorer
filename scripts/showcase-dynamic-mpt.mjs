#!/usr/bin/env node
/**
 * showcase-dynamic-mpt.mjs
 *
 * Submits four DynamicMPT transactions to a local rippled standalone and prints
 * Explorer URLs to review each UI surface:
 *   1. MPTokenIssuanceCreate — all mutable (no ImmutableFlags)
 *   2. MPTokenIssuanceCreate — with ImmutableFlags set
 *   3. MPTokenIssuanceSet   — enable capabilities via tfMPTSetCan* Flags
 *   4. MPTokenIssuanceSet   — update TransferFee + lock flags via ImmutableFlags
 *
 * Usage:
 *   node scripts/showcase-dynamic-mpt.mjs
 *   EXPLORER=http://localhost:3001/localhost node scripts/showcase-dynamic-mpt.mjs
 */

const ENDPOINT = process.env.RIPPLED ?? 'http://localhost:5005'
const GENESIS_ACCOUNT = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const GENESIS_SECRET = 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb'
const EXPLORER = process.env.EXPLORER ?? 'http://localhost:3001/localhost'

// ── RPC helpers ───────────────────────────────────────────────────────────────

async function rpc(method, params = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, params: [params] }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { result } = await res.json()
  if (result.error) throw new Error(`${result.error}: ${result.error_message ?? ''}`)
  return result
}

async function submit(txJson) {
  const result = await rpc('submit', { tx_json: txJson, secret: GENESIS_SECRET })
  const eng = result.engine_result
  if (eng !== 'tesSUCCESS' && eng !== 'terQUEUED') {
    throw new Error(`${eng}: ${result.engine_result_message}`)
  }
  return result.tx_json.hash
}

async function advanceLedger() {
  await rpc('ledger_accept')
}

async function getValidatedTx(hash) {
  // retry a few times in case the ledger hasn't closed yet
  for (let i = 0; i < 5; i++) {
    try {
      const result = await rpc('tx', { transaction: hash })
      if (result.validated) return result
    } catch (_) {}
    await new Promise(r => setTimeout(r, 200))
  }
  throw new Error(`tx ${hash} not validated after retries`)
}

// ── XLS-0089 MPT metadata schemas ────────────────────────────────────────────
// Short key names per spec: t=ticker, n=name, d=desc, i=icon, ac=asset_class,
// as=asset_subclass (required for ac=rwa), in=issuer_name, us=uris, ai=additional_info

// Issuance A: DeFi token, all capabilities still mutable at creation.
const METADATA_A = {
  t: 'DYNX',
  n: 'DynToken Flex',
  d: 'A DeFi token demonstrating DynamicMPT — all capabilities mutable at creation. The issuer can still enable escrow, trade, clawback, and more via MPTokenIssuanceSet.',
  i: 'https://example.org/dynx/icon.png',
  ac: 'defi',
  in: 'XRPL Foundation',
}

// Issuance B: RWA (treasury) token with CanLock, RequireAuth, and Metadata
// permanently locked at issuance via ImmutableFlags.
const METADATA_B = {
  t: 'RTBIL',
  n: 'T-Bill Yield Token',
  d: 'Yield-bearing token backed by U.S. Treasuries. CanLock, RequireAuth, and Metadata are permanently immutable — set once at issuance and can never be changed.',
  i: 'https://example.org/rtbil/icon.png',
  ac: 'rwa',
  as: 'treasury',
  in: 'XRPL Foundation',
  us: [
    { u: 'https://example.org/rtbil', c: 'website', t: 'Product Page' },
  ],
  ai: { interest_rate: '5.00%', maturity_date: '2027-06-30' },
}

// TX4 update to Issuance A: new metadata after locking CanTrade, CanTransfer,
// and TransferFee — reflects the permanent change in the description.
const METADATA_A_UPDATED = {
  t: 'DYNX',
  n: 'DynToken Flex',
  d: 'Updated via MPTokenIssuanceSet: TransferFee raised to 0.075%. CanTrade, CanTransfer, and TransferFee are now permanently immutable.',
  i: 'https://example.org/dynx/icon.png',
  ac: 'defi',
  in: 'XRPL Foundation',
  us: [
    { u: 'https://example.org/dynx', c: 'website', t: 'Product Page' },
  ],
}

function toHex(obj) {
  const json = typeof obj === 'string' ? obj : JSON.stringify(obj)
  return Buffer.from(json, 'utf8').toString('hex').toUpperCase()
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Connecting to ${ENDPOINT} …`)
  const { info } = await rpc('server_info')
  console.log(`  rippled ${info.build_version}  network_id=${info.network_id}\n`)

  const { account_data } = await rpc('account_info', {
    account: GENESIS_ACCOUNT,
    ledger_index: 'current',
  })
  let seq = account_data.Sequence
  console.log(`  Genesis account: ${GENESIS_ACCOUNT}  seq=${seq}\n`)

  const results = {}

  // ── TX 1: Create — all mutable (no ImmutableFlags) ──────────────────────────
  // Flags: tfMPTCanTransfer (0x20)
  // Metadata: XLS-0089 JSON (ac=defi), all capabilities mutable.
  // Shows: Create Simple with NO "Immutable Flags" row.
  // Settings: 7 "Can Enable" badges on unlocked disabled caps;
  //           Metadata + TransferFee field rows visible with no badge.
  console.log('TX1  MPTokenIssuanceCreate — all mutable (DYNX / DeFi)')
  const hash1 = await submit({
    TransactionType: 'MPTokenIssuanceCreate',
    Account: GENESIS_ACCOUNT,
    Sequence: seq++,
    Fee: '200',
    Flags: 0x00000020,           // tfMPTCanTransfer
    AssetScale: 6,
    MaximumAmount: '1000000000000',
    TransferFee: 100,            // 0.010% — still mutable
    MPTokenMetadata: toHex(METADATA_A),
  })
  await advanceLedger()
  const tx1 = await getValidatedTx(hash1)
  const issuanceIdA = tx1.meta?.mpt_issuance_id ?? '?'
  results.tx1 = { hash: hash1, issuanceId: issuanceIdA }
  console.log(`  hash       : ${hash1}`)
  console.log(`  issuance ID: ${issuanceIdA}\n`)

  // ── TX 2: Create — with ImmutableFlags ──────────────────────────────────────
  // Flags: tfMPTCanTransfer (0x20) | tfMPTRequireAuth (0x04)
  // ImmutableFlags: tifMPTCanLock(0x2) + tifMPTRequireAuth(0x4) + tifMPTMetadata(0x10000)
  //               = 0x10006 = 65542
  // Metadata: XLS-0089 JSON (ac=rwa, as=treasury), with URIs and ai fields.
  // Shows: Create Simple "Immutable Flags" row listing tifMPTCanLock,
  //        tifMPTRequireAuth, tifMPTMetadata; metadata renders as JSON in Detail.
  // Settings: CanLock + RequireAuth → "Immutable" badge;
  //           Metadata field row → "Immutable" badge; TransferFee row mutable.
  console.log('TX2  MPTokenIssuanceCreate — with ImmutableFlags (RTBIL / RWA treasury)')
  const hash2 = await submit({
    TransactionType: 'MPTokenIssuanceCreate',
    Account: GENESIS_ACCOUNT,
    Sequence: seq++,
    Fee: '200',
    Flags: 0x00000024,           // tfMPTCanTransfer | tfMPTRequireAuth
    AssetScale: 2,
    MaximumAmount: '9223372036854775807',
    TransferFee: 500,            // 0.500%
    MPTokenMetadata: toHex(METADATA_B),
    ImmutableFlags: 0x00010006,  // tifMPTCanLock + tifMPTRequireAuth + tifMPTMetadata
  })
  await advanceLedger()
  const tx2 = await getValidatedTx(hash2)
  const issuanceIdB = tx2.meta?.mpt_issuance_id ?? '?'
  results.tx2 = { hash: hash2, issuanceId: issuanceIdB }
  console.log(`  hash       : ${hash2}`)
  console.log(`  issuance ID: ${issuanceIdB}\n`)

  // ── TX 3: Set — enable capabilities via tfMPTSetCan* Flags ──────────────────
  // Flags: tfMPTSetCanEscrow(0x10) | tfMPTSetCanTrade(0x20) = 0x30
  // Shows: Set Simple with NO ImmutableFlags row; the tfMPTSetCan* bits appear
  //        automatically in the Detail tab via TX_FLAGS.MPTokenIssuanceSet.
  console.log('TX3  MPTokenIssuanceSet — enable CanEscrow + CanTrade on Issuance A')
  const hash3 = await submit({
    TransactionType: 'MPTokenIssuanceSet',
    Account: GENESIS_ACCOUNT,
    Sequence: seq++,
    Fee: '200',
    MPTokenIssuanceID: issuanceIdA,
    Flags: 0x00000030,           // tfMPTSetCanEscrow | tfMPTSetCanTrade
  })
  await advanceLedger()
  results.tx3 = { hash: hash3 }
  console.log(`  hash: ${hash3}\n`)

  // ── TX 4: Set — update TransferFee + metadata + lock via ImmutableFlags ──────
  // ImmutableFlags: tifMPTCanTrade(0x10) + tifMPTCanTransfer(0x20) + tifMPTTransferFee(0x20000)
  //               = 0x20030 = 131120
  // Metadata: updated XLS-0089 JSON reflecting the new locked state.
  // Shows: Set Simple with TransferFee row (0.075%), Metadata row (JSON rendered),
  //        and "Immutable Flags" row listing tifMPTCanTrade, tifMPTCanTransfer,
  //        tifMPTTransferFee.
  console.log('TX4  MPTokenIssuanceSet — update metadata + TransferFee + lock via ImmutableFlags on Issuance A')
  const hash4 = await submit({
    TransactionType: 'MPTokenIssuanceSet',
    Account: GENESIS_ACCOUNT,
    Sequence: seq++,
    Fee: '200',
    MPTokenIssuanceID: issuanceIdA,
    TransferFee: 750,            // update: 0.010% → 0.075%
    MPTokenMetadata: toHex(METADATA_A_UPDATED),
    ImmutableFlags: 0x00020030,  // tifMPTCanTrade + tifMPTCanTransfer + tifMPTTransferFee
  })
  await advanceLedger()
  results.tx4 = { hash: hash4 }
  console.log(`  hash: ${hash4}\n`)

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════════')
  console.log('  EXPLORER URLS')
  console.log('═══════════════════════════════════════════════════════════════════\n')

  console.log('── MPTokenIssuanceCreate / Simple view ─────────────────────────────')
  console.log('  TX1  DYNX — no ImmutableFlags ("Immutable Flags" row absent)')
  console.log(`  ${EXPLORER}/transactions/${results.tx1.hash}/simple`)
  console.log()
  console.log('  TX2  RTBIL — ImmutableFlags=0x10006 (tifMPTCanLock, tifMPTRequireAuth, tifMPTMetadata)')
  console.log(`  ${EXPLORER}/transactions/${results.tx2.hash}/simple`)
  console.log()

  console.log('── MPTokenIssuanceSet / Simple view ────────────────────────────────')
  console.log('  TX3  tfMPTSetCanEscrow + tfMPTSetCanTrade (see Detail tab for flag decode)')
  console.log(`  ${EXPLORER}/transactions/${results.tx3.hash}/simple`)
  console.log()
  console.log('  TX4  TransferFee + Metadata (JSON) + ImmutableFlags rows')
  console.log(`  ${EXPLORER}/transactions/${results.tx4.hash}/simple`)
  console.log()

  console.log('── MPT token Settings page ─────────────────────────────────────────')
  console.log('  Issuance A  DYNX — "Can Enable" on unlocked caps; CanTrade+CanTransfer+TransferFee → "Immutable"')
  console.log(`  ${EXPLORER}/token/mpt/${results.tx1.issuanceId}`)
  console.log()
  console.log('  Issuance B  RTBIL — CanLock+RequireAuth+Metadata → "Immutable"; TransferFee still mutable')
  console.log(`  ${EXPLORER}/token/mpt/${results.tx2.issuanceId}`)
  console.log()
  console.log('═══════════════════════════════════════════════════════════════════')
}

main().catch(err => {
  console.error('\nFatal:', err.message)
  process.exit(1)
})
