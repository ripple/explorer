module.exports = tx => {
  return {
    amendment: tx.Amendment,
    flags: tx.Flags,
    date: tx.date,
  };
};
