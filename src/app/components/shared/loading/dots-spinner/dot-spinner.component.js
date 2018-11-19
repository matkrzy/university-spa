import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './dot-spinner.module.scss';

export class DotSpinnerComponent extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <span>loading</span>
      </div>
    );
  }
}
