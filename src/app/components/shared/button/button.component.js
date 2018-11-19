import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

export class Button extends Component {
  render() {
    const { type = 'button', onDoubleClick, disabled } = this.props;

    const buttonClassNames = classNames(styles.button, this.props.className, {
      [styles.disabled]: disabled,
    });

    const onClick = this.props.onClick && !disabled ? this.props.onClick : null;

    return (
      <button className={buttonClassNames} onClick={onClick} onDoubleClick={onDoubleClick} type={type}>
        {this.props.children}
      </button>
    );
  }
}
