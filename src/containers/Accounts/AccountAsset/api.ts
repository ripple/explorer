import {
  mockHeldIOUs,
  mockHeldMPTs,
  mockHeldLP,
  mockHeldNFT,
  issuedIOUs,
  issuedMPs as issuedMPTs,
  issuedNFTs,
} from './mockData'

const randomDelay = () => {
  const delay = Math.floor(Math.random() * 1000) + 1000 // 1000-2000ms
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// These mimic real HTTP fetchers; replace implementations later.
export const getHeldIOUs = async () => {
  await randomDelay()
  return mockHeldIOUs
}

export const getHeldMPTs = async () => {
  await randomDelay()
  return mockHeldMPTs
}

export const getHeldNFTs = async () => {
  await randomDelay()
  return mockHeldNFT
}

export const getIssuedIOUs = async () => {
  await randomDelay()
  return issuedIOUs
}

export const getIssuedMPTs = async () => {
  await randomDelay()
  return issuedMPTs
}

export const getIssuedNFTs = async () => {
  await randomDelay()
  return issuedNFTs
}
