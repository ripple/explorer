import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UrlContext from './urlContext';

const InternalLink = props => {
  const { urlLink } = useContext(UrlContext);

  // console.log('HIIIIIIIII IN INTERNALLINK');
  // eslint-disable-next-line react/prop-types -- temporary
  const { className, to, onClick, title, style, children } = props;
  // console.log(urlLink, to, `${urlLink}${to}`);
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

// InternalLink.propTypes = {
//   to: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   parentPath: PropTypes.string.isRequired,
// };

export default InternalLink;
