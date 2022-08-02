module.exports = (d) =>
  d.value
    ? {
        currency: d.currency,
        issuer: d.issuer,
        amount: Number(d.value),
      }
    : {
        currency: 'XRP',
        amount: d / 1000000,
      }
