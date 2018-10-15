import React, { Component } from 'react';

import styles from './context-menu-item.module.scss';

export class ContextMenuItemComponent extends Component {
  render() {
    return (
      <div {...this.props.events} className={styles.item}>
        {this.props.label}
      </div>
    );
  }
}
