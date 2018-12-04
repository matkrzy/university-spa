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
  };

  render() {
    const { input, meta, placeholder, label, disabled, asyncErrors, options, fixedValue, components } = this.props;

    const invalid = meta.invalid;
    const error = asyncErrors ? meta.error : meta.touched && meta.error;

    const inputClassNames = classNames(this.props.inputClassName, {
      invalid: error || invalid,
      active: meta.active,
      disabled,
    });

    return (
      <label className={classNames('form-control', this.props.className)}>
        {!!label && <span className="label">{label}</span>}

        <Select
          isDisabled={this.props.disabled}
          className={inputClassNames}
          value={options.find(({ id }) => id === fixedValue || id === input.value)}
          onChange={this.handleChange}
          options={options}
          placeholder={placeholder}
          getOptionLabel={({ label }) => label}
          getOptionValue={({ id }) => id}
          //menuPortalTarget={document.body}
          //menuPlacement={'auto'}
          //menuPosition={'absolute'}
          components={components}
        />
        {error ? <span>{meta.error}</span> : <span> </span>}
      </label>
    );
  }
}
