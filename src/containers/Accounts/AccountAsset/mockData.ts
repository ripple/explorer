function genHeldIOUs(count = 20) {
  const codes = [
    'RLUSD',
    'SOLO',
    'EXMP',
    'TOKN',
    'XUSD',
    'ABC',
    'DEF',
    'GHI',
    'JKL',
    'MNO',
  ]
  const issuers = [
    'Ripple',
    'Sologenic',
    'Issuer A',
    'Issuer B',
    'Issuer C',
    'Issuer D',
    'Issuer E',
    'Issuer F',
    'Issuer G',
    'Issuer H',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % codes.length
    return {
      code: codes[idx],
      issuer: issuers[idx],
      price: `$${(10 + idx * 5 + (i % 7)).toFixed(2)}`,
      balance: `${(i + 1) * 10}`,
      balanceUsd: `$${((i + 1) * 10 * 1.23).toFixed(2)}`,
      assetClass: idx % 2 === 0 ? 'RWA' : 'Defi',
      fee: `${(0.05 + idx * 0.01).toFixed(2)}%`,
      frozen: idx % 3 === 0 ? 'Global' : idx % 3 === 1 ? '--' : 'Trustline',
    }
  })
}

function genHeldMPTs(count = 20) {
  const tickers = [
    'RLUSD',
    'SOLO',
    'NAME',
    'TOKA',
    'TOKB',
    'TOKC',
    'TOKD',
    'TOKE',
    'TOKF',
    'TOKG',
  ]
  const issuers = [
    'Ripple',
    'Sologenic',
    'Name Inc',
    'Issuer 4',
    'Issuer 5',
    'Issuer 6',
    'Issuer 7',
    'Issuer 8',
    'Issuer 9',
    'Issuer 10',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % tickers.length
    const base = (i + 1000).toString(16).toUpperCase().slice(0, 8)
    return {
      tokenId: `r${base}C...K${base}X`,
      ticker: tickers[idx],
      issuer: issuers[idx],
      price: `$${(1 + idx * 3 + (i % 5)).toFixed(2)}`,
      balance: `${(i + 1) * 100}`,
      balanceUsd: `$${((i + 1) * 100 * 1.1).toFixed(2)}`,
      assetClass: idx % 2 === 0 ? 'RWA' : 'Tokenized',
      fee: `${(0.05 + idx * 0.02).toFixed(2)}%`,
      frozen: idx % 3 === 0 ? 'Global' : '--',
    }
  })
}

function genHeldLPTokens(count = 20) {
  const pairs = [
    'MAG/XRP',
    'ETH/BTC',
    'LTC/USDT',
    'BNB/ETH',
    'SOL/DOT',
    'AAA/BBB',
    'CCC/DDD',
    'EEE/FFF',
    'GGG/HHH',
    'III/JKL',
  ]
  const instances = Array.from(
    { length: count },
    (_, i) => `rLp${(i + 1).toString(16).toUpperCase()}`,
  )
  return Array.from({ length: count }, (_, i) => {
    const idx = i % pairs.length
    return {
      ammInstance: instances[i],
      ammPair: pairs[idx],
      balance: `${(i + 1) * 50}`,
      balanceUsd: `${((i + 1) * 50 * (idx + 1)).toFixed(2)} USD`,
      share: `${((i % 100) / 100).toFixed(2)}%`,
    }
  })
}

/* NFT generators */
function genHeldNFTs(count = 100) {
  const issuers = [
    'r9f2dD...qH7zX',
    'rU6BEsJ...gM9Vn',
    'rEb8TK...uK8dM',
    'rsoLo2...z3p4q',
    'rPEPPER...BEANS',
    'rGwUw...g4fk4',
    'rN7n7...pD45K',
    'rhB9c...tV9pW',
    'rJbV3D...hN6bA',
    'rUCLG...pT5sR',
  ]
  const urls = [
    'xrpl-validator.net',
    'gatehub.net',
    'bithomp.com',
    'xumm.app',
    'ripple.com',
    'coinfield.com',
    'bitstamp.net',
    'alloy-network.io',
    'xrpl.cafe',
    'onxrp.com',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % issuers.length
    const base = (i + 1).toString(16).toUpperCase().padStart(8, '0')
    return {
      tokenId: `${base}...${base}C${(i % 9) + 1}`,
      issuer: issuers[idx],
      url: urls[idx % urls.length],
      fee: `${(idx === 3 ? 0 : (idx + 1) * 0.05).toFixed(2)}%`,
      lowestAsk: `${(idx + 1) * 10} XRP`,
      highestBid: `${(idx + 1) * 7 + (i % 3)} XRP`,
    }
  })
}

function genIssuedNFTs(count = 100) {
  const urls = [
    'www.website.com',
    'www.crypto-exchange.io',
    'www.staking-rewards.net',
    'www.nft-market.art',
    'www.defi-lending.org',
    'www.secure-wallet.app',
    'www.payment-gateway.com',
    'www.crypto-gaming.co',
    'www.trading-bot.ai',
    'www.cross-chain-bridge.fi',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % urls.length
    const base = (i + 11111111).toString(16).toUpperCase()
    return {
      tokenId: `${base}...${base.slice(0, 8)}`,
      url: urls[idx],
      fee: `${(idx === 7 ? 5.0 : (idx + 1) * 0.15).toFixed(2)}%`,
      lowestAsk: `${(idx + 1) * 123} XRP`,
      highestBid: `${(idx + 1) * 10 + (i % 5)} XRP`,
    }
  })
}

/* Issued generators */
function genIssuedIOUs(count = 20) {
  const codes = [
    'RLUSD',
    'SOLO',
    'EXMP',
    'TOKN',
    'XUSD',
    'ISS1',
    'ISS2',
    'ISS3',
    'ISS4',
    'ISS5',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % codes.length
    return {
      code: codes[idx],
      price: `$${(5 + idx * 2 + (i % 3)).toFixed(2)}`,
      trustlines: `${1000 + i * 10}`,
      holders: `${500 + i * 5}`,
      supply: `${100000 + i * 1000}`,
      assetClass: idx % 2 === 0 ? 'RWA' : 'Other',
      fee: `${(0.02 + idx * 0.01).toFixed(2)}%`,
      frozen: idx % 3 === 0 ? 'Global' : '--',
    }
  })
}

function genIssuedMPTs(count = 20) {
  const tickers = [
    'RLUSD',
    'SOLO',
    'ISSU',
    'MP01',
    'MP02',
    'MP03',
    'MP04',
    'MP05',
    'MP06',
    'MP07',
  ]
  return Array.from({ length: count }, (_, i) => {
    const idx = i % tickers.length
    const base = (i + 4000).toString(16).toUpperCase().slice(0, 8)
    return {
      tokenId: `rIss${base}...${base}Y`,
      ticker: tickers[idx],
      price: `$${(2 + idx * 1.5 + (i % 4)).toFixed(2)}`,
      supply: `${1000 + i * 50}`,
      assetClass: idx % 2 === 0 ? 'RWA' : 'Utility',
      fee: `${(0.05 + idx * 0.005).toFixed(2)}%`,
      frozen: idx % 2 === 0 ? 'Global' : '--',
    }
  })
}

/* exports */
export const mockHeldIOUs = genHeldIOUs(20)
export const mockHeldMPTs = genHeldMPTs(20)
export const mockHeldLP = genHeldLPTokens(20)
export const mockHeldNFT = genHeldNFTs(100)

export const issuedIOUs = genIssuedIOUs(20)
export const issuedMPs = genIssuedMPTs(20)
export const issuedNFTs = genIssuedNFTs(100)
