import axios from 'axios'
/* eslint-disable import/no-unresolved -- Avoids 8kb gzipped of bloat and V.PayString code. */
import { parsePayString } from '@paystring/utils/dist/parse'
import { convertPayStringToUrl } from '@paystring/utils/dist/convert'
/* eslint-enable import/no-unresolved */
import logger from './lib/logger'

const log = logger({ name: 'payString' })

export interface PayStringResponse {
  payString: string
  addresses: {
    paymentNetwork: string
    environment: string
    addressDetailsType: string
    addressDetails: {
      address: string
      tag?: string
    }
  }[]
}

export const getPayString = (payString): Promise<PayStringResponse> => {
  log.info(`get paystring: ${payString}`)

  const payStringUrl = convertPayStringToUrl(payString).toString()

  return axios
    .get(payStringUrl, {
      headers: { Accept: `application/payid+json`, 'PayID-Version': '1.0' },
    })
    .then((response) => response.data)
}

export const isValidPayString = (payId) => {
  try {
    parsePayString(payId)
    return true
  } catch (e) {
    return false
  }
}
