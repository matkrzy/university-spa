import React, { Component } from 'react';

import styles from './context-menu-item.module.scss';

/** Class representing a `ContextMenuItemComponent`
 * It will render context menu item
 * @extends Component
 */
export class ContextMenuItemComponent extends Component {
  render() {
    return (
      <div {...this.props.events} className={styles.item}>
        {this.props.label}
      </div>
    );
  }
}
