import React from 'react'
import PropTypes from 'prop-types'

const AccountDelete = (props) => {
  const { t, data } = props
  const { account } = data.instructions
  return <></>
}
AccountDelete.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
  t: PropTypes.func.isRequired,
}

export default AccountDelete
