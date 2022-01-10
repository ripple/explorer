module.exports = tx => {
  return {
    validator: tx.UNLModifyValidator,
    disabling: tx.UNLModifyDisabling,
  };
};
