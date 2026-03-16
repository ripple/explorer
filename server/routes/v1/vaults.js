const axios = require('axios')
const log = require('../../lib/logger')({ name: 'vaults' })

const getVaults = async (req, res) => {
  try {
    const { page, size, sort_by, sort_order, asset_type, name_like } = req.query

    const params = new URLSearchParams()
    if (page) params.set('page', page)
    if (size) params.set('size', size)
    if (sort_by) params.set('sort_by', sort_by)
    if (sort_order) params.set('sort_order', sort_order)
    if (asset_type) params.set('asset_type', asset_type)
    if (name_like) params.set('name_like', name_like)

    const url = `${process.env.VITE_LOS_URL}/vaults?${params.toString()}`
    log.info(`Fetching vaults from: ${url}`)

    const resp = await axios.get(url, { timeout: 30000 })
    console.log(
      '[LOS] GET /vaults response:',
      JSON.stringify(resp.data, null, 2),
    )
    return res.status(200).json(resp.data)
  } catch (error) {
    log.error('Failed to fetch vaults:', error.message)
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message })
  }
}

const getVaultsAggregateStats = async (_req, res) => {
  try {
    const url = `${process.env.VITE_LOS_URL}/vaults/aggregate-statistics`
    log.info(`Fetching vault aggregate stats from: ${url}`)

    const resp = await axios.get(url, { timeout: 30000 })
    console.log(
      '[LOS] GET /vaults/aggregate-statistics response:',
      JSON.stringify(resp.data, null, 2),
    )
    return res.status(200).json(resp.data)
  } catch (error) {
    log.error('Failed to fetch vault aggregate stats:', error.message)
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message })
  }
}

module.exports = {
  getVaults,
  getVaultsAggregateStats,
}
