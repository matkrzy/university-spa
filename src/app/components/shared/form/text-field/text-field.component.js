import React, { Component } from 'react';
import classNames from 'classnames';

export class TextFieldComponent extends Component {
  static defaultProps = {
    asyncErrors: false,
    inputClassName: null,
  };

  render() {
    const { input, type, meta, placeholder, label, id, disabled, asyncErrors, specializedProps } = this.props;

    const invalid = meta.invalid;
    const error = asyncErrors ? meta.error : meta.touched && meta.error;

    const inputClassNames = classNames('input', this.props.inputClassName, {
      invalid: error || invalid,
      active: meta.active,
      disabled,
    });

    return (
      <label className={classNames('form-control', this.props.className)}>
        {!!label && <span className="label">{label}</span>}
        <input
          className={inputClassNames}
          {...input}
          placeholder={placeholder}
          id={id}
          disabled={disabled}
          type={type}
          {...specializedProps}
        />
        {error ? <span>{meta.error}</span> : <span> </span>}
      </label>
    );
  }
}
