import { FC } from 'react';

export interface Instructions {
  owner: string;
  sequence: number;
  ticketSequence: number;
  fulfillment: string;
  finishAfter: string;
  cancelAfter: string;
  condition: string;
  quorum: number;
  max: {
    amount: number;
    currency: string;
    issuer: string;
  };
  signers: any[];
  domain: string;
  // eslint-disable-next-line camelcase
  email_hash: string;
  // eslint-disable-next-line camelcase
  message_key: string;
  // eslint-disable-next-line camelcase
  set_flag: number;
  // eslint-disable-next-line camelcase
  clear_flag: number;
  key: string;
  limit: any;
  pair: string;
  sourceTag: number;
  source: string;
  claimed: any;
  // eslint-disable-next-line camelcase
  channel_amount: number;
  remaining: number;
  renew: boolean;
  close: boolean;
  deleted: boolean;
  gets: any;
  pays: any;
  price: string;
  cancel: number;
  convert: any;
  amount: any;
  destination: string;
  partial: boolean;
  ticketCount: number;
}

export interface TransactionTableDetailProps {
  instructions: Instructions;
}
export type TransactionTableDetailComponent = FC<TransactionTableDetailProps>;

export interface TransactionDescriptionProps {
  data: {
    tx: any;
  };
}
export type TransactionDescriptionComponent = FC<TransactionDescriptionProps>;

export interface TransactionSimpleProps {
  data: {
    instructions?: any;
  };
}
export type TransactionSimpleComponent = FC<TransactionSimpleProps>;

export interface TransactionMapping {
  Description: TransactionDescriptionComponent;
  Simple: TransactionSimpleComponent;
  TableDetail: TransactionTableDetailComponent;
  mapper: (tx: any) => any;
}
