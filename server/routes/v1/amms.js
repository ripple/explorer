const axios = require('axios')
const log = require('../../lib/logger')({ name: 'amms' })

const LOS_URL = process.env.VITE_LOS_URL

/**
 * GET /api/v1/amms
 * Fetch top AMMs with sorting
 */
const getAMMs = async (req, res) => {
  try {
    const { size = 1000, sort_field = 'tvl_usd', sort_order = 'desc' } = req.query
    
    log.info(`Fetching AMMs: size=${size}, sort_field=${sort_field}, sort_order=${sort_order}`)
    
    const url = `${LOS_URL}/amms`
    const response = await axios.get(url, {
      params: {
        size,
        sort_field,
        sort_order,
      },
    })
    
    log.info(`Fetched ${response.data.results?.length || 0} AMMs`)
    
    return res.status(200).json(response.data)
  } catch (error) {
    log.error(`Failed to fetch AMMs: ${error.message}`)
    return res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data 
    })
  }
}

/**
 * GET /api/v1/amms/aggregated
 * Fetch aggregated AMM statistics
 * This fetches the special "aggregated" document from the amms index
 */
const getAggregatedStats = async (req, res) => {
  try {
    log.info('Fetching aggregated AMM stats')

    // The LOS API uses /amms/{id} where id can be "aggregated"
    const url = `${LOS_URL}/amms/aggregated`
    const response = await axios.get(url)

    log.info('Fetched aggregated stats')

    return res.status(200).json(response.data)
  } catch (error) {
    log.error(`Failed to fetch aggregated stats: ${error.message}`)
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    })
  }
}

/**
 * GET /api/v1/amms/historical-trends
 * Fetch historical trends for AMM data
 */
const getHistoricalTrends = async (req, res) => {
  try {
    const { amm_account_id = 'aggregated', time_range = '6M' } = req.query

    log.info(`Fetching historical trends: amm_account_id=${amm_account_id}, time_range=${time_range}`)

    // Note: The LOS API Gateway route is /amms/historical-trends
    const url = `${LOS_URL}/amms/historical-trends`
    const response = await axios.get(url, {
      params: {
        amm_account_id,
        time_range,
      },
    })

    log.info(`Fetched ${response.data.total_data_points || 0} data points`)

    return res.status(200).json(response.data)
  } catch (error) {
    log.error(`Failed to fetch historical trends: ${error.message}`)
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    })
  }
}

module.exports = {
  getAMMs,
  getAggregatedStats,
  getHistoricalTrends,
}

