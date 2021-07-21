import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import './tabs.css';

const Tabs = props => {
  const { t, tabs, selected, path } = props;
  const items = tabs.map(title => {
    const className = selected === title ? 'tab selected' : 'tab';
    return (
      <Link className={className} title={t(title)} key={title} to={`${path}/${title}`}>
        {t(title)}
      </Link>
    );
  });
  return <div className="tabs">{items}</div>;
};

Tabs.propTypes = {
  selected: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  path: PropTypes.string,
  t: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  selected: null,
  path: '',
};

export default translate()(Tabs);
