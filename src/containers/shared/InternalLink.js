import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UrlContext from './urlContext';

const InternalLink = props => {
  const { urlLink } = useContext(UrlContext);

  const { className, to, onClick, title, style, children } = props;
  return (
    <Link
      className={className}
      to={`${urlLink}${to}`}
      onClick={onClick}
      title={title}
      style={style}
    >
      {children}
    </Link>
  );
};

InternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.shape({
    color: PropTypes.string,
  }),
  children: PropTypes.string.isRequired,
};

InternalLink.defaultProps = {
  className: undefined,
  onClick: undefined,
  title: undefined,
  style: {},
};

export default InternalLink;
