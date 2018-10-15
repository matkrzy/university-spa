import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import { ContextMenuItemComponent } from './item/context-menu-item.component';

import styles from './context-menu.module.scss';

export class ContextMenu extends Component {
  handleClickOutside() {
    if (this.props.onClose) {
      this.props.onClose();
    }

    this.props.onContextMenu(false);
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { x: left, y: top } = this.props.position;

    return (
      <div className={styles.wrapper} style={{ top, left }}>
        {this.props.title && <div className={styles.title}>{this.props.title}</div>}
        <div className={styles.body}>
          {this.props.options.map((option, index) => (
            <ContextMenuItemComponent label={option.label} events={option.events} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export const ContextMenuComponent = onClickOutside(ContextMenu);
