import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { ButtonSvg } from 'app/components/shared';

import styles from './node-edit-custom-select-option.module.scss';

const handleEditClick = e => {
  e.stopPropagation();
};

const handleRemoveClick = e => {
  e.stopPropagation();
};

export const NodeEditCustomSelectOption = props => {
  const { innerProps, label, getStyles, data } = props;
  const optionStyles = omit(getStyles('option', props), ['display']);

  const { canRemove } = data;

  return (
    <div {...innerProps} style={optionStyles} className={styles.option}>
      <span>{label}</span>
      {canRemove && (
        <span>
          <ButtonSvg icon="✖" className={classNames('cursor-pointer', styles.button)} onClick={handleRemoveClick} />
          <ButtonSvg icon="✏" className={classNames('cursor-pointer')} onClick={handleEditClick} />
        </span>
      )}
    </div>
  );
};
