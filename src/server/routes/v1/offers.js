const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'offers' });

const getBookOffers = async (currencyCode, issuerAddress, pairCurrencyCode, pairIssuerAddress) => {
  try {
    // log.info('fetching book offers from rippled');
    let orderBook = await rippled.getOffers(
      currencyCode,
      issuerAddress,
      pairCurrencyCode,
      pairIssuerAddress
    );
    const { offers } = orderBook;
    if (offers.length === 0) {
      return orderBook;
    }
    let rateSum = 0;
    let highestExchangeRate = 0;
    let lowestExchangeRate = Number.MAX_VALUE;
    for (const offer of offers) {
      const takerPays = offer.TakerPays.value || offer.TakerPays;
      const takerGets = offer.TakerGets.value || offer.TakerGets;
      const rate = takerPays / takerGets;
      if (rate > highestExchangeRate) {
        highestExchangeRate = rate;
      }
      if (rate < lowestExchangeRate) {
        lowestExchangeRate = rate;
      }
      rateSum += rate;
    }
    const averageExchangeRate = rateSum / offers.length;

    offers.sort((offerA, offerB) => {
      return offerA.PreviousTxnLgrSeq - offerB.PreviousTxnLgrSeq;
    });

    orderBook = {
      ...orderBook,
      averageExchangeRate,
      highestExchangeRate,
      lowestExchangeRate,
      offers,
    };

    return orderBook;
  } catch (error) {
    log.error(error.toString());
    return { message: error.message };
  }
};

export default getBookOffers;
