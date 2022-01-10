module.exports = tx => {
  const ticketCount = tx.TicketCount;
  const ticketSequence = tx.TicketSequence;
  return {
    ticketCount,
    ticketSequence,
  };
};
