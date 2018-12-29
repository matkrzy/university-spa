import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import classNames from 'classnames';

export class ButtonSvg extends Component {
  renderButton = () => {
    const { disabled } = this.props;

    const buttonClassNames = classNames(this.props.className, 'cursor-pointer', {
      disabled: disabled,
    });

    return (
      <span className={buttonClassNames} role="img" onClick={e => !disabled && this.props.onClick(e)}>
        {this.props.icon}
      </span>
    );
  };

  render() {
    if (this.props.disabled) {
      return (
        <Tooltip overlayClassName={this.props.overlayClassName} overlay={this.props.message}>
          {this.renderButton()}
        </Tooltip>
      );
    }

    return this.renderButton();
  }
}
