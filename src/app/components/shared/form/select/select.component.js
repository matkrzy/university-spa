import React, { Component } from 'react';
import classNames from 'classnames';
import Select from 'react-select';

export class SelectFieldComponent extends Component {
  static defaultProps = {
    asyncErrors: false,
    inputClassName: null,
    disabled: false,
  };

  handleChange = selectedOption => {
    this.props.input.onChange(selectedOption.id);
    this.props.input.onBlur();
  };

  handleFocus = e => {
    document.body.classList.add('ignore-react-onclickoutside');
    this.props.input.onFocus(e);
  };

  handleBlur = e => {
    document.body.classList.remove('ignore-react-onclickoutside');
    this.props.input.onBlur(e);
  };

  render() {
    const { input, meta, placeholder, label, disabled, asyncErrors, options, fixedValue, components } = this.props;

    const invalid = meta.touched && meta.invalid;
    const error = asyncErrors ? meta.error : meta.touched && meta.error;

    const inputClassNames = classNames(this.props.inputClassName, {
      invalid: error || invalid,
      active: meta.active,
      disabled,
    });

    const customStyles = {
      menuPortal: provided => ({ ...provided, zIndex: 99999999999 }),
    };

    return (
      <label className={classNames('form-control', this.props.className)}>
        {!!label && <span className="label">{label}</span>}

        <Select
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurInputOnSelect={true}
          isDisabled={this.props.disabled}
          className={inputClassNames}
          value={options.find(({ id }) => id === fixedValue || id === input.value)}
          onChange={this.handleChange}
          options={options}
          placeholder={placeholder}
          getOptionLabel={({ label }) => label}
          getOptionValue={({ id }) => id}
          menuPlacement={'bottom'}
          components={components}
          menuPortalTarget={document.body}
          styles={customStyles}
          classNamePrefix={'react-select'}
        />
        {error ? <span>{meta.error}</span> : <span> </span>}
      </label>
    );
  }
}
