import { localizeNumber } from './utils';

export const RIPPLE_EPOCH = 946684800;
export const SUCCESSFULL_TRANSACTION = 'tesSUCCESS';
export const XRP_BASE = 1000000;
export const hexMatch = new RegExp('^(0x)?[0-9A-Fa-f]+$');
export const ACCOUNT_ZERO = 'rrrrrrrrrrrrrrrrrrrrrhoLvTp';

export const TX_FLAGS: Record<string, Record<number, string>> = {
  all: {
    0x80000000: 'tfFullyCanonicalSig',
  },
  Payment: {
    0x00010000: 'tfNoDirectRipple',
    0x00020000: 'tfPartialPayment',
    0x00040000: 'tfLimitQuality',
  },
  AccountSet: {
    0x00010000: 'tfRequireDestTag',
    0x00020000: 'tfOptionalDestTag',
    0x00040000: 'tfRequireAuth',
    0x00080000: 'tfOptionalAuth',
    0x00100000: 'tfDisallowXRP',
    0x00200000: 'tfAllowXRP',
  },
  OfferCreate: {
    0x00010000: 'tfPassive',
    0x00020000: 'tfImmediateOrCancel',
    0x00040000: 'tfFillOrKill',
    0x00080000: 'tfSell',
  },
  TrustSet: {
    0x00010000: 'tfSetAuth',
    0x00020000: 'tfSetNoRipple',
    0x00040000: 'tfClearNoRipple',
    0x00100000: 'tfSetFreeze',
    0x00200000: 'tfClearFreeze',
  },
  PaymentChannelClaim: {
    0x00010000: 'tfRenew',
    0x00020000: 'tfClose',
  },
};

export const ACCOUNT_FLAGS: Record<number, string> = {
  9: 'asfDepositAuth',
  8: 'asfDefaultRipple',
  7: 'asfGlobalFreeze',
  6: 'asfNoFreeze',
  5: 'asfAccountTxnID',
  4: 'asfDisableMaster',
  3: 'asfDisallowXRP',
  2: 'asfRequireAuth',
  1: 'asfRequireDest',
};

export const CURRENCY_ORDER = [
  'CNY',
  'JPY',
  'CHF',
  'CAD',
  'NZD',
  'AUD',
  'GBP',
  'USD',
  'EUR',
  'LTC',
  'ETH',
  'BTC',
  'XAG',
  'XAU',
  'XRP',
];

export const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: '',
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
};

interface Node {
  DeletedNode?: any;
  ModifiedNode?: any;
  CreatedNode?: any;
  LedgerEntryType: string;
}

interface Meta {
  AffectedNodes: Node[];
}

interface Memo {
  Memo: {
    MemoType: string;
    MemoData: string;
    MemoFormat: string;
  };
}

interface Tx {
  Memos: Memo[];
  TransactionType: string;
  Flags: number;
}

interface Transaction {
  meta: Meta;
  tx: Tx;
}

interface IssuedCurrencyAmount {
  currency: string;
  issuer: string;
  value: string;
}

export function groupAffectedNodes(trans: Transaction) {
  const group: Record<string, Node[]> = {
    created: [],
    modified: [],
    deleted: [],
  };
  (trans.meta.AffectedNodes || []).forEach(node => {
    if (node.DeletedNode) {
      group.deleted.push(node.DeletedNode);
    } else if (node.ModifiedNode) {
      group.modified.push(node.ModifiedNode);
    } else if (node.CreatedNode) {
      group.created.push(node.CreatedNode);
    }
  });
  group.modified.sort((a, b) => a.LedgerEntryType.localeCompare(b.LedgerEntryType));
  return group;
}

export function decodeHex(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const v = parseInt(hex.substr(i, 2), 16);
    str += v ? String.fromCharCode(v) : '';
  }
  return str;
}

export function buildMemos(trans: Transaction) {
  const { Memos = [] } = trans.tx;
  const memoList: string[] = [];
  Memos.forEach(data => {
    if (hexMatch.test(data.Memo.MemoType)) {
      memoList.push(decodeHex(data.Memo.MemoType));
    }

    if (hexMatch.test(data.Memo.MemoData)) {
      memoList.push(decodeHex(data.Memo.MemoData));
    }

    if (hexMatch.test(data.Memo.MemoFormat)) {
      memoList.push(decodeHex(data.Memo.MemoFormat));
    }
  });
  return memoList;
}

export function buildFlags(trans: Transaction) {
  const flags = TX_FLAGS[trans.tx.TransactionType] || {};
  const bits = zeroPad((trans.tx.Flags || 0).toString(2), 32).split('');

  return bits
    .map((value, i) => {
      const bin = zeroPad(1, 32 - i, true);
      const int = parseInt(bin, 2);
      // const type = i < 8 ? 'universal' : (i < 16 ? 'type_specific' : 'reserved');
      return value === '1' ? TX_FLAGS.all[int] || flags[int] || hex32(int) : undefined;
    })
    .filter(d => Boolean(d));
}

function hex32(d: number): string {
  const int = d & 0xffffffff;
  const hex = int.toString(16).toUpperCase();
  return `0x${`00000000${hex}`.slice(-8)}`;
}

function zeroPad(num: string | number, size: number, back = false): string {
  let s = String(num);
  while (s.length < (size || 2)) {
    s = back ? `${s}0` : `0${s}`;
  }

  return s;
}

export function normalizeAmount(
  amount: IssuedCurrencyAmount | number,
  language = 'en-US'
): string | null {
  const currency = typeof amount === 'object' ? amount.currency : 'XRP';
  const value = typeof amount === 'object' ? amount.value : amount / XRP_BASE;
  const numberOption = { ...CURRENCY_OPTIONS, currency };
  return localizeNumber(value, language, numberOption);
}

export function findNode(transaction: Transaction, nodeType: keyof Node, entryType: string): Node {
  const metaNode = transaction.meta.AffectedNodes.find(
    node => node[nodeType] && node[nodeType].LedgerEntryType === entryType
  );
  return metaNode ? metaNode[nodeType] : null;
}
