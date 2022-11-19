export function parser(tx: any) {
  const ticketCount = tx.TicketCount
  const ticketSequence = tx.TicketSequence
  return {
    ticketCount,
    ticketSequence,
  }
}
