const axios = require('axios')
const log = require('../../lib/logger')({ name: 'validator-report' })

const fetchValidatorReport = (id) =>
  axios
    .get(`${process.env.REACT_APP_DATA_URL}/validator/${id}/reports`)
    .then((response) => response.data.reports)

module.exports = async (req, res) => {
  const { id: validator } = req.params

  log.info('get validator report')
  const validatorReports = await fetchValidatorReport(validator)
  const sortedValidatorReports = validatorReports.sort((a, b) =>
    a.date > b.date ? -1 : 1,
  )
  return res.status(200).json(sortedValidatorReports)
}
