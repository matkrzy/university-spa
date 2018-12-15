import React, { Component } from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import classNames from 'classnames';

import 'rc-time-picker/assets/index.css';
import styles from './time-picker.module.scss';

export class TimePickerComponent extends Component {
  static defaultProps = {
    showSecond: false,
    format: 'HH:mm',
  };

  state = {
    open: false,
  };

  onFocus = () => this.setState({ open: true });

  onBlur = () => this.setState({ open: false });

  onChange = value => this.props.input.onChange(value.format(this.props.format));

  handleKeyPress = e => {
    switch (e.key) {
      case 'Enter': {
        this.setState({ open: false });
        break;
      }
      default:
        return false;
    }
  };

  getValue = () => {
    const {
      input: { value },
      format,
    } = this.props;

    if (typeof value === 'string') {
      if (value === '') {
        return moment('00:00', format);
      } else {
        return moment(value, format);
      }
    }

    return value;
  };

  render() {
    const { input, meta, placeholder, label, disabled, asyncErrors, showSecond, format } = this.props;

    const invalid = meta.invalid;
    const error = asyncErrors ? meta.error : meta.touched && meta.error;

    const timepickerClassNames = classNames(
      styles['time-picker'],
      'ignore-react-onclickoutside',
      this.props.inputClassName,
      {
        invalid: error || invalid,
        active: meta.active,
        disabled,
      },
    );

    return (
      <label className={classNames('form-control', this.props.className)}>
        {!!label && <span className="label">{label} (mm:ss)</span>}
        <TimePicker
          defaultValue={this.getValue()}
          open={this.state.open}
          className={timepickerClassNames}
          popupClassName={classNames(styles['time-picker-panel'], 'ignore-react-onclickoutside')}
          {...input}
          showSecond={showSecond}
          onChange={this.onChange}
          value={this.getValue()}
          placeholder={placeholder}
          onFocus={this.onFocus}
          onClose={this.onBlur}
          onKeyDown={this.handleKeyPress}
        />
      </label>
    );
  }
}
