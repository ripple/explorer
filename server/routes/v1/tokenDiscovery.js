const { BigQuery } = require('@google-cloud/bigquery');
const rippled = require('../../lib/rippled');

const log = require('../../lib/logger')({ name: 'token discovery' });

// Whether this is running in the prod environment (or in dev/staging)
// For the purpose of running locally, this equals false if the env var doesn't exist
// DO NOT SET TO TRUE UNLESS YOU'RE SURE ABOUT BIGQUERY USAGE
// aka don't let the site run after you're done using it, because it'll cost $$
const IS_PROD_ENV = process.env.REACT_APP_MAINNET_LINK?.includes('xrpl.org');
// How long the auto-caching should run in dev and staging environments
// We want to turn it off after some time so it doesn't run when we don't need it, which costs us
// money per BigQuery query
const TIME_TO_TEST = 1000 * 60 * 60 * 6; // 6 hours (2 tests)

const TIME_INTERVAL = 1000 * 60 * 60 * 3; // 3 hours

const NUM_TOKENS_FETCH_ALL = 10;

const cachedTokensList = { tokens: [], time: null };

let options = {
  projectId: process.env.GOOGLE_APP_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_APP_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
};

const bigQuery = new BigQuery(options);

async function getAccountInfo(issuer, currencyCode) {
  const balances = await rippled.getBalances(issuer);
  const obligations = balances.obligations[currencyCode.toUpperCase()];
  const info = await rippled.getAccountInfo(issuer);
  const domain = info.Domain ? Buffer.from(info.Domain, 'hex').toString() : undefined;
  return { domain, gravatar: info.urlgravatar, obligations };
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

  // This is running in mostly series instead of aggressively parallel on purpose.
  // It prevents the Explorer from getting caught by rate-limiting on the rippled node.
  for (let i = 0; i <= NUM_TOKENS_FETCH_ALL; i += 1) {
    const { issuer, currency } = rankedTokens[i];
    const promises = [];
    promises.push(getAccountInfo(issuer, currency));
    promises.push(getExchangeRate(issuer, currency));
    try {
      // eslint-disable-next-line no-await-in-loop -- okay here, helps run slower so we don't get rate limited
      const [accountInfo, exchangeRate] = await Promise.all(promises);

      const { domain, gravatar, obligations } = accountInfo;
      const newInfo = {
        ...rankedTokens[i],
        domain,
        gravatar,
        obligations,
        exchangeRate,
      };
      rankedTokens[i] = newInfo;
    } catch (error) {
      log.error(error);
      return undefined;
    }
  }

  return rankedTokens;
}

async function cacheTokensList() {
  try {
    log.info('caching tokens');
    const tokens = await getTokensList();
    cachedTokensList.tokens = tokens;
    cachedTokensList.time = Date.now();
  } catch (error) {
    log.error(error);
  }
}

// Starts the caching process for bigquery
function startCaching() {
  // Only run if on mainnet (the tokens page doesn't exist on devnet/testnet)
  if (process.env.REACT_APP_ENVIRONMENT !== 'mainnet') {
    return;
  }
  // Initialize the cache
  cacheTokensList();
  // Cache every TIME_INTERVAL ms (only starts after one interval)
  const intervalId = setInterval(() => cacheTokensList(), TIME_INTERVAL);
  // Stop the auto-running of the caching in the previous line after TIME_TO_TEST ms
  // Only do this if not in the prod env, so we don't have excessive BigQuery queries when we're
  // not actually using what's in the dev and staging environments
  // We don't want regular caching to stop in prod, though, because then a missed cache would
  // result in a several-second delay while the query is re-run, and this is a poor UX
  if (!IS_PROD_ENV) {
    setTimeout(() => {
      log.info('stopping caching tokens');
      clearInterval(intervalId);
    }, TIME_TO_TEST);
  }
}

startCaching();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (req, res) => {
  // * * * * * * * * IMPORTANT * * * * * * * * * * * *
  // Running the BigQuery query costs money. Don't let it run if you don't need to.
  log.info(`getting token discovery`);
  try {
    // If it's been a while since caching happened in the non-prod envs, then restart the caching
    // (needed because `startCaching` turns off caching after TIME_TO_TEST for non-prod envs)
    if (
      // true if in dev or staging
      !IS_PROD_ENV &&
      // true if the cache has already been initialized (i.e. if `startCaching` has already run at
      // least once)
      // (prevents race conditions where an API call is made on container startup before the
      // initial `startCaching` has returned)
      cachedTokensList.time != null &&
      // true if some time has passed since the cache was last updated (i.e. `startCaching` was
      // turned off)
      // This uses `TIME_INTERVAL * 2` to prevent race conditions around `TIME_INTERVAL`, in case
      // the cache just took some time to load but `startCaching` has already been triggered
      Date.now() - cachedTokensList.time > TIME_INTERVAL * 2
    ) {
      // Reset the cache so the API call waits below until it's been refilled
      cachedTokensList.tokens = [];
      cachedTokensList.time = null;
      startCaching();
    }
    while (cachedTokensList.tokens.length === 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000);
    }

    res.send({
      result: 'success',
      updated: cachedTokensList.time,
      tokens: cachedTokensList.tokens,
    });
  } catch (error) {
    log.error(error);
    res.send({ result: 'error', message: 'internal error' });
  }
};
