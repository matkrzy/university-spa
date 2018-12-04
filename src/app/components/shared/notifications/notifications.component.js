import React, { Component } from 'react';

import styles from './notifications.module.scss';

export class NotificationsComponent extends Component {
  timeout = 3000;
  interval = undefined;

  constructor(props) {
    super(props);

    this.setInterval();
  }

  setInterval = () => {
    this.interval = setInterval(this.props.notificationsTake, this.timeout);
  };

  resetInterval = () => {
    clearInterval(this.interval);
  };

  componentDidUpdate(prevProps) {
    const { list } = this.props;

    if (!list.length) {
      this.resetInterval();
    }

    if (list.length !== 0 && prevProps.list.length === 0) {
      this.setInterval();
    }
  }

  render() {
    return (
      <div className={styles.notifications}>
        {this.props.list.map(({ message }, index) => (
          <div className={styles.notification} key={index}>
            {message}
          </div>
        ))}
      </div>
    );
  }
}
