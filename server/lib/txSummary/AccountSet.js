module.exports = tx => ({
  domain: tx.Domain,
  email_hash: tx.EmailHash,
  message_key: tx.MessageKey,
  set_flag: tx.SetFlag,
  clear_flag: tx.ClearFlag,
  tick: tx.TickSize,
  rate: tx.TransferRate,
});
