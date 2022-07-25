import React from 'react';
import PropTypes from 'prop-types';
import copy from '../images/copy.png';

interface Props {
  text: string;
  styleName: string;
}

const Copy = (props: Props) => {
  const { text, styleName } = props;

  return (
    <input
      className={styleName}
      type="image"
      src={copy}
      alt="Copy"
      onClick={() => navigator.clipboard.writeText(text)}
    />
  );
};
Copy.propTypes = {
  text: PropTypes.string,
  styleName: PropTypes.string,
};

Copy.defaultProps = {
  text: '',
  styleName: 'copy',
};

export default Copy;
