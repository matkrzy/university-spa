import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import onClickOutside from 'react-onclickoutside';

import { ContextMenuItemComponent } from './item/context-menu-item.component';

import styles from './context-menu.module.scss';

/** Class representing a `ContextMenuComponent`
 * @extends Component
 */
export class ContextMenu extends Component {
  /**
   * Handler for click outside of the component.
   * It will close context menu
   */
  handleClickOutside() {
    if (this.props.onClose) {
      this.props.onClose();
    }

    this.props.onContextMenu(false);
  }

  /**
   * Render method create portal for context menu and render the context menu
   */
  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { x: left, y: top } = this.props.position;

    return createPortal(
      <div className={styles.wrapper} style={{ top, left }}>
        {this.props.title && <div className={styles.title}>{this.props.title}</div>}
        <div className={styles.body}>
          {this.props.options.map((option, index) => (
            <ContextMenuItemComponent label={option.label} events={option.events} key={index} />
          ))}
        </div>
      </div>,
      document.getElementsByTagName('body')[0],
    );
  }
}

export const ContextMenuComponent = onClickOutside(ContextMenu);
