import React, { Component } from 'react';
import classNames from 'classnames';

export class CheckboxComponent extends Component {
  static defaultProps = {
    inputClassName: null,
  };

  render() {
    const { input, meta, label, id, asyncErrors, disabled } = this.props;

    const invalid = meta.invalid;
    const error = asyncErrors ? meta.error : meta.touched && meta.error;

    const inputClassNames = classNames('input', this.props.inputClassName, {
      invalid: error || invalid,
      active: meta.active,
      disabled,
    });

    return (
      <label className={classNames(this.props.className, 'form-control')}>
        {!!label && <span className="label">{label}</span>}
        <input className={inputClassNames} {...input} id={id} type={this.props.type} disabled={disabled} />
        {error ? <span>{meta.error}</span> : <span> </span>}
      </label>
    );
  }
}
