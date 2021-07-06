import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as QuestIcon } from '../../shared/images/hover_question.svg';

const ToolTip = props => {
  const { tooltipText, altText } = props;

  return (
    <span className="q-tooltip" data-tooltip={tooltipText}>
      <QuestIcon alt={altText} className="question" />
    </span>
  );
};

ToolTip.propTypes = {
  tooltipText: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
};

export default ToolTip;
