import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import classNames from 'classnames';

export class ButtonSvg extends Component {
  renderButton = () => {
    const buttonClassNames = classNames(this.props.className, {
      disabled: this.props.disabled,
    });

    return (
      <span className={buttonClassNames} role="img" onClick={this.props.onClick}>
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
