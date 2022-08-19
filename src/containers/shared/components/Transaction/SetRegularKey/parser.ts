export function parser(tx: any) {
  return {
    key: tx.RegularKey || null,
  }
}
