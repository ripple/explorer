import PropTypes from 'prop-types'
import { transactionTypes } from '../../shared/components/Transaction'
import { DefaultSimple } from '../../shared/components/Transaction/DefaultSimple'

export const Simple = ({ data, type }) => {
  // Locate the component for the left side of the simple tab that is unique per TransactionType.
  const SimpleComponent = transactionTypes[type]?.Simple
  if (SimpleComponent) {
    return <SimpleComponent data={data} />
  }
  return <DefaultSimple data={data} />
}

Simple.propTypes = {
  data: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
}
