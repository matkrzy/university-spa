import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';

import { NODE_INPUT, UPDATE_CONNECTIONS_EVENT } from '../../../dictionary';

import styles from './node-list-item.module.scss';

const uuid = require('uuid/v4');

/** Class representing a `NodeListItem`
 * @extends Component
 */
export class NodeListItem extends Component {
  /**
   * It will set up default state of `NodeListItem`
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      id: props.id || uuid(),
      connections: 0,
    };
  }

  /**
   * When component is mounted it will add event listener on connections update event
   */
  componentDidMount() {
    document.addEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  /**
   * It will remove listeners when component will be unmount
   */
  componentWillUnmount() {
    document.removeEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  /**
   * Getter of item id
   * @return {string} uuid of `NodeListItem`
   */
  getId = () => this.state.id;

  /**
   * Helper for calculation connections for specific node based on node ID and type of item
   * @param {updateConnectionEvent} e - custom update connection event created in `GraphSpace`
   */
  calculateConnections = e => {
    this.setState({
      connections: e.detail.calculateConnections(this.state.id, this.props.type),
    });
  };

  /**
   * Handler for mouse down on `NodeListItem`. Check if connection can be created and then call `onMouseDown` from props
   * or returns `null`
   *
   * @param e
   * @return {null}
   */
  handleMouseDown = e => {
    if (this.state.connections >= this.props.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.onMouseDown(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  /**
   * Handler for mouse up on `NodeListItem`. Check if connection can be created and then call `onMouseUp` from props
   * or returns `null`
   *
   * @param e
   * @return {null}
   */
  handleMouseUp = e => {
    if (this.state.connections >= this.props.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.onMouseUp(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  /**
   * Helper for render list item
   * @return {*}
   */
  renderElement = () => {
    const indicatorClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]: this.state.connections >= this.props.maxConnections || this.props.disabled,
    });

    const itemClassNames = classNames(styles.item, styles[`item--${this.props.type}`]);

    return (
      <li className={itemClassNames}>
        <div
          className={indicatorClassNames}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          id={this.state.id}
        />
        <span className={styles.label}>{this.props.label}</span>
      </li>
    );
  };

  render() {
    if (this.state.connections >= Number(this.props.maxConnections)) {
      return (
        <Tooltip
          placement={this.props.type === NODE_INPUT ? 'left' : 'right'}
          overlay="Maximum connections reached"
          overlayClassName={styles.tooltip}
        >
          {this.renderElement()}
        </Tooltip>
      );
    }

    return this.renderElement();
  }
}
