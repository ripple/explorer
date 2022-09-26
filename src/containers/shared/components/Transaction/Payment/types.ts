import React from 'react'
import {
  TransactionParser,
  TransactionSimpleComponent,
  TransactionTableDetailComponent,
} from '../types'

export interface PaymentSimpleProps {
  data: {
    instructions: {
      partial: boolean
      amount: {
        amount: number
        currency: string
      }
      max: {
        amount: number
        currency: string
      }
      convert: {
        amount: number
        currency: string
      }
      destination:
        | {
            split: any
          }
        | string
      sourceTag: number
    }
  }
}

export type TransactionDescriptionComponent = React.FC<PaymentDescriptionProps>

export interface PaymentDescriptionProps<T = any> {
  data: {
    tx: T
    meta?: T
  }
  partial: boolean
}

export interface TransactionMapping {
  Description?: TransactionDescriptionComponent
  Simple: TransactionSimpleComponent
  TableDetail?: TransactionTableDetailComponent
  parser: TransactionParser
}
