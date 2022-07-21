import React from 'react';
import PropTypes from 'prop-types';
import copy from '../images/copy.png';

interface Props {
  text: string;
}

const Copy = (props: Props) => {
  const { text } = props;

  return (
    <input type="image" src={copy} alt="copy" onClick={() => navigator.clipboard.writeText(text)} />
  );
};
Copy.propTypes = {
  text: PropTypes.string,
};

Copy.defaultProps = {
  text: '',
};

export default Copy;
