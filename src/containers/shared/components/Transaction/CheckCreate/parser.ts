export function parser(tx: any, meta: any) {
  return { ...tx, ...meta }
}
