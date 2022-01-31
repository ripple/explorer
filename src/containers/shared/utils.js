import axios from 'axios';
import { getQuorum, getNegativeUNL } from '../../rippled';
import Log from './log';

const THOUSAND = 1000;
const MILLION = THOUSAND * THOUSAND;
const BILLION = MILLION * THOUSAND;
const TRILLION = BILLION * THOUSAND;
const QUADRILLION = TRILLION * THOUSAND;

const GA_ID = process.env.REACT_APP_GA_ID;

const EXOTIC_SYMBOLS = {
  BTC: '\u20BF',
  XRP: '\uE900',
  ETH: '\uE902',
};

export const TITLE_LENGTH = 77;
export const NOT_FOUND = 404;
export const SERVER_ERROR = 500;
export const BAD_REQUEST = 400;

export const DECIMAL_REGEX = /^\d+$/;
export const RIPPLE_ADDRESS_REGEX = /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/;
export const HASH_REGEX = /[0-9A-Fa-f]{64}/i;
export const CURRENCY_REGEX = /^[a-zA-Z0-9]{3,}\.r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/;
export const FULL_CURRENCY_REGEX = /^[0-9A-Fa-f]{40}\.r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$/;

export const UP_COLOR = '#2BCB96';
export const DOWN_COLOR = '#F23548';
export const LINE_COLOR = '#0F72E5';
export const BLACK_20 = '#E1E4E8';
export const BLACK_30 = '#C9CDD1';
export const BLACK_40 = '#B1B5BA';
export const BLACK_60 = '#6B7075';
export const WHITE = '#FFFFFF';

export const BREAKPOINTS = {
  desktop: 1200,
  landscape: 900,
  portrait: 600,
  phone: 415,
};

export const ANALYTIC_TYPES = {
  pageview: 'pageview',
  event: 'event',
  social: 'social',
  timing: 'timing',
  exception: 'exception',
};

const NUMBER_DEFAULT_OPTIONS = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
  useGrouping: true,
};

export const normalizeLanguage = lang => {
  if (!lang) {
    return undefined;
  }

  if (lang === 'en' || lang === 'en-US' || lang.indexOf('en-') === 0) {
    return 'en-US'; // Only US English supported now
  }
  if (lang === 'zh' || lang === 'zh-Hans' || lang === 'zh-Hant' || lang.indexOf('zh-') === 0) {
    return 'zh-Hans'; // Only Simplified chinese supported now
  }
  if (lang === 'ja' || lang === 'ja-JP' || lang.indexOf('ja-') === 0) {
    return 'ja-JP'; // Japanese
  }
  if (lang === 'ko' || lang === 'ko-KR' || lang === 'ko-KP' || lang.indexOf('ko-') === 0) {
    return 'ko-KP'; // Korean
  }
  if (
    lang === 'es' ||
    lang === 'es-ES' ||
    lang === 'es-MX' ||
    lang === 'es-AR' ||
    lang === 'es-CO' ||
    lang === 'es-CL' ||
    lang.indexOf('es-') === 0
  ) {
    return 'es-MX'; // Mexican Spanish
  }
  if (lang === 'pt-PT' || lang === 'pt-BR' || lang.indexOf('pt-') === 0) {
    return 'pt-BR'; // Brazilian Portuguese
  }

  return undefined;
};

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const localizeNumber = (num, lang = 'en-US', options = {}) => {
  const number = Number.parseFloat(num);
  const config = { ...NUMBER_DEFAULT_OPTIONS, ...options };

  if (Number.isNaN(number)) {
    return null;
  }
  if (config.style === 'currency') {
    try {
      const neg = number < 0 ? '-' : '';
      const d = new Intl.NumberFormat(lang, config).format(number);
      const index = d.search(/\d/);
      const symbol = d
        .slice(0, index)
        .replace(/-/, '')
        .trim();
      const newSymbol =
        EXOTIC_SYMBOLS[config.currency] ||
        (symbol.toUpperCase() === config.currency.toUpperCase() ? '' : symbol);
      return `${neg}${newSymbol}${d.slice(index)}`;
    } catch (error) {
      config.style = 'decimal';
      delete config.currency;
      return Intl.NumberFormat(lang, config).format(number);
    }
  }

  return new Intl.NumberFormat(lang, config).format(number);
};

export function formatPrice(number, lang = 'en-US', currency = 'USD', decimals = 4) {
  return number
    ? localizeNumber(number.toPrecision(decimals), lang, {
        style: 'currency',
        currency,
      })
    : undefined;
}

// Document: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
export const localizeDate = (date, lang = 'en-US', options = {}) => {
  // TODO: default config
  if (!date) {
    return null;
  }
  return new Intl.DateTimeFormat(lang, options).format(date);
};

/**
 * extract new items from top of array b using iterator
 * and merge it into the state array a.
 * @param {list} a The transactions in state.
 * @param {list} b The new transactions from props.
 * @returns {list} Concatenated list.
 */
export const concatTx = (a, b) => {
  if (a.length === 0) return b;
  if (b.length === 0) return a;
  if (a[0].hash === b[0].hash) return a;

  // joins if b has only old new transactions or has new ones on top of old ones.
  let iterator = 0;
  for (iterator = 0; iterator < b.length; iterator += 1) {
    if (b[iterator].hash === a[0].hash) {
      break;
    }
  }
  return a.concat(b.slice(0, iterator));
};

export const getLocalizedCurrencySymbol = (lang = 'en-US', currency = 'USD') => {
  const options = {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  };

  const formatted = localizeNumber(1, lang, options);
  return formatted.split('1')[0].trim();
};

export const formatLargeNumber = (d = 0, digits = 4) => {
  let variableDigits = digits;
  let numberOfZeros = 0;
  let numberCopy = d;
  if (d >= QUADRILLION) {
    return {
      num: (d / QUADRILLION).toFixed(digits),
      unit: 'Q',
    };
  }

  if (d >= TRILLION) {
    return {
      num: (d / TRILLION).toFixed(digits),
      unit: 'T',
    };
  }

  if (d >= BILLION) {
    return {
      num: (d / BILLION).toFixed(digits),
      unit: 'B',
    };
  }

  if (d >= MILLION) {
    return {
      num: (d / MILLION).toFixed(digits),
      unit: 'M',
    };
  }

  if (d >= THOUSAND) {
    return {
      num: (d / THOUSAND).toFixed(digits),
      unit: 'K',
    };
  }

  while (numberCopy < 1 && variableDigits < 20) {
    numberCopy *= 10;
    numberOfZeros += 1;
    variableDigits = numberOfZeros > variableDigits - 1 ? variableDigits + 1 : variableDigits;
  }

  // handle zeros
  variableDigits = Math.trunc(d.toFixed(20)) === 0 ? digits : variableDigits;

  if (digits < variableDigits) {
    variableDigits = digits;
  }

  return {
    num: d.toFixed(variableDigits),
    unit: '',
  };
};

// Document: https://developers.google.com/analytics/devguides/collection/analyticsjs/
export const analytics = (type = null, fields = {}) => {
  // Chek if GoogleAnalytics is set, type and fields are not empty, type is valid
  if (
    !window.gtag ||
    !type ||
    Object.keys(fields).length === 0 ||
    Object.keys(ANALYTIC_TYPES).indexOf(type) === -1
  ) {
    return false;
  }

  // Check for required fields for each type
  switch (type) {
    case ANALYTIC_TYPES.pageview:
      if (!!fields.title && !!fields.path) {
        window.gtag('config', GA_ID, { page_title: fields.title, page_path: fields.path });
        return true;
      }
      break;
    case ANALYTIC_TYPES.event:
      if (!!fields.eventCategory && !!fields.eventAction) {
        window.gtag('event', fields.eventAction, {
          event_category: fields.eventCategory,
          event_label: fields.eventLabel,
        });
        return true;
      }
      break;
    case ANALYTIC_TYPES.exception:
      if (fields.exDescription) {
        window.gtag('event', 'exception', { description: fields.exDescription });
        return true;
      }
      break;
    default:
      return false;
  }

  return false;
};

export const durationToHuman = (s, decimal = 2) => {
  const d = {};
  const seconds = Math.abs(s);

  if (seconds < 60) {
    d.num = seconds;
    d.unit = 'sec.';
  } else if (seconds < 60 * 60) {
    d.num = seconds / 60;
    d.unit = 'min.';
  } else if (seconds < 60 * 60 * 24) {
    d.num = seconds / (60 * 60);
    d.unit = 'hr.';
  } else if (seconds < 60 * 60 * 24 * 180) {
    d.num = seconds / (60 * 60 * 24);
    d.unit = 'd.';
  } else if (seconds < 60 * 60 * 24 * 365 * 2) {
    d.num = seconds / (60 * 60 * 24 * 30.5);
    d.unit = 'mo.';
  } else {
    d.num = seconds / (60 * 60 * 24 * 365);
    d.unit = 'yr.';
  }

  return `${d.num.toFixed(decimal)} ${d.unit}`;
};

export const fetchNegativeUNL = async (rippledUrl = null) => {
  return getNegativeUNL(rippledUrl)
    .then(data => {
      if (data === undefined) throw new Error('undefined nUNL');

      return data;
    })
    .catch(e => Log.error(e));
};

export const fetchQuorum = async (rippledUrl = null) => {
  return getQuorum(rippledUrl)
    .then(data => {
      if (data === undefined) throw new Error('undefined quorum');
      return data;
    })
    .catch(e => Log.error(e));
};

export const fetchMetrics = () => {
  return axios
    .get('/api/v1/metrics')
    .then(result => {
      return result.data;
    })
    .catch(e => Log.error(e));
};

export const removeRoutes = (routes, ...routesToRemove) => {
  return routes.filter(route => {
    return !routesToRemove.includes(route.title);
  });
};
