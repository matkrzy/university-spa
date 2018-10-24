import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

export class Button extends Component {
  render() {
    const buttonClassNames = classNames(styles.button, this.props.className, {
      [styles.disabled]: this.props.disabled,
    });
    const onClick = this.props.onClick ? this.props.onClick : null;

    return (
      <button className={buttonClassNames} onClick={onClick}>
        {this.props.children}
      </button>
    );
  }
}
