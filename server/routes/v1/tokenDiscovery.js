const { BigQuery } = require('@google-cloud/bigquery');
const streams = require('../../lib/streams');
const rippled = require('../../lib/rippled');
const { formatAccountInfo } = require('../../lib/utils');

const log = require('../../lib/logger')({ name: 'token discovery' });

const TIME_INTERVAL = 1000 * 60 * 30; // 30 minutes

const NUM_TOKENS_FETCH_ALL = 10;

const cachedTokensList = { tokens: [], date: null };

let options = {
  projectId: process.env.GOOGLE_APP_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_APP_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_APP_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
};

const bigQuery = new BigQuery(options);

async function getAccountInfo(issuer, currencyCode) {
  const balances = await rippled.getBalances(issuer);
  const obligations = balances.obligations[currencyCode.toUpperCase()];
  const info = await rippled.getAccountInfo(issuer);
  const { domain, gravatar } = formatAccountInfo(info, streams.getReserve());
  return { domain, gravatar, obligations };
}

async function getExchangeRate(issuer, currencyCode) {
  const { offers } = await rippled.getOffers(currencyCode, issuer, 'XRP', undefined);
  const reducer = (acc, offer) => {
    const takerPays = offer.TakerPays.value || offer.TakerPays;
    const takerGets = offer.TakerGets.value || offer.TakerGets;
    const rate = takerPays / takerGets;
    return Math.min(acc, rate);
  };
  return offers.reduce(reducer, Number.MAX_VALUE) / 1000000;
}

async function getTokensList() {
  const query = `WITH
    trusted_issuers as (
      SELECT LimitAmountDEX.issuer, LimitAmountDEX.currency, count(distinct Account) as count_trustlines
      FROM \`xrpledgerdata.fullhistory.transactions\`
      WHERE TransactionType = 'TrustSet'
      GROUP BY 1,2
      HAVING count(distinct Account)>=50
    ),
    ranked_trustlines as (
      SELECT ti.issuer, ti.currency, t.Account, l.CloseTime, t.LimitAmountDEX.value, ti.count_trustlines, row_number() over (partition by ti.issuer, ti.currency, t.Account order by l.CloseTime desc) as rnk
      FROM trusted_issuers ti
      LEFT join \`xrpledgerdata.fullhistory.transactions\` t
        on ti.issuer = t.LimitAmountDEX.issuer and ti.currency = t.LimitAmountDEX.currency and t.TransactionType = 'TrustSet'
      LEFT join \`xrpledgerdata.fullhistory.ledgers\` l
        on t.LedgerIndex = l.LedgerIndex
    )
    SELECT rt.issuer, rt.currency, rt.count_trustlines as trustlines, sum(p.volume) as volume
    FROM ranked_trustlines rt
    LEFT join (
        SELECT t.AmountDEX.currency as currency, t.AmountDEX.issuer as issuer, sum(t.AmountDEX.value) as volume
        FROM \`xrpledgerdata.fullhistory.transactions\` t
        LEFT join \`xrpledgerdata.fullhistory.ledgers\` l
            on t.LedgerIndex = l.LedgerIndex
        WHERE t.TransactionType = 'Payment' and TIMESTAMP(l.CloseTime) > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY) and (t.SendMaxDEX is not null or t.SendMaxXRP is not null)
        GROUP BY t.AmountDEX.currency, t.AmountDEX.issuer
    ) p
        on p.currency = rt.currency and p.issuer = rt.issuer
    WHERE rnk = 1
    GROUP BY 1,2,3
    ORDER BY count_trustlines DESC`;

  options = { query, location: 'US' };
  const [rankedTokens] = await bigQuery.query(options);

  const promises = [];
  for (let i = 0; i <= NUM_TOKENS_FETCH_ALL; i += 1) {
    const { issuer, currency } = rankedTokens[i];
    promises.push(getAccountInfo(issuer, currency));
    promises.push(getExchangeRate(issuer, currency));
  }

  return Promise.all(promises)
    .then(results => {
      for (let i = 0; i < results.length; i += 2) {
        const tokenIndex = i / 2;
        const { domain, gravatar, obligations } = results[i];
        const exchangeRate = results[i + 1];
        const newInfo = {
          ...rankedTokens[tokenIndex],
          domain,
          gravatar,
          obligations,
          exchangeRate
        };
        rankedTokens[tokenIndex] = newInfo;
      }
      return rankedTokens;
    })
    .catch(error => {
      log.error(error);
    });
}

async function cacheTokensList() {
  try {
    const tokens = await getTokensList();
    cachedTokensList.tokens = tokens;
    cachedTokensList.date = Date.now();
    setTimeout(cacheTokensList, TIME_INTERVAL);
  } catch (error) {
    log.error(error);
  }
}

cacheTokensList();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (req, res) => {
  log.info(`getting token discovery`);
  try {
    while (cachedTokensList.tokens.length === 0) {
      sleep(1000);
    }

    res.send({
      result: 'success',
      updated: cachedTokensList.date,
      tokens: cachedTokensList.tokens
    });
  } catch (error) {
    log.error(error);
    res.send({ result: 'error', message: 'internal error' });
  }
};
