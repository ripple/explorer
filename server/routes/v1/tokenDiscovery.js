const { BigQuery } = require('@google-cloud/bigquery');

const log = require('../../lib/logger')({ name: 'token discovery' });

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const cachedTokensList = { tokens: [], time: null };

let options = {
  projectId: process.env.GOOGLE_APP_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_APP_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_APP_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
};

const bigQuery = new BigQuery(options);

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

  return rankedTokens;
}

async function cacheTokensList() {
  try {
    cachedTokensList.tokens = await getTokensList();
    cachedTokensList.date = Date.now();
  } catch (error) {
    log.error(error.toString());
  }
}

module.exports = async (req, res) => {
  log.info(`getting token discovery`);
  try {
    if (
      cachedTokensList.tokens.length === 0 ||
      Date.now() - cachedTokensList.date > DAY_IN_MILLISECONDS
    ) {
      await cacheTokensList();
    }

    res.send({
      result: 'success',
      updated: cachedTokensList.date,
      tokens: cachedTokensList.tokens
    });
  } catch {
    res.send({ result: 'error', message: 'internal error' });
  }
};
