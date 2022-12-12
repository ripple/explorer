const url = 'https://api.onthedex.live/public/v1'

/*
https://api.onthedex.live/public/v1/daily/pairs?token=CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr&quote=SOLO.rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz
 */
export function getTokenPairData(
  asset1: { currency: string; issuer?: string },
  asset2: { currency: string; issuer?: string },
) {
  const asset1url = `token=${asset1.currency}${
    asset1.issuer ? `.${asset1.issuer}` : ''
  }`
  const asset2url = `quote=${asset2.currency}${
    asset2.issuer ? `.${asset2.issuer}` : ''
  }`
  const tokenPairURL = `${url}/daily/pairs?${asset1url}&${asset2url}`

  return fetch(tokenPairURL).then((response) => {
    if (!response.ok || response.status !== 200) {
      throw new Error(response.statusText)
    }

    return response.json()
  })
}
