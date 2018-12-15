import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import { compose } from 'redux';
import get from 'lodash/get';

import { withCurrentConnection, withPortEvents, withNodeActions } from '../../contexts';

import { NODE_INPUT, NODE_TYPES } from '../../dictionary';

import { connectionsEventBus } from '../../../events/connections/connectionsEventBus';
import {
  CONNECTION_REMOVE,
  CONNECTION_ADD,
  CONNECTION_CALCULATE,
} from '../../../events/connections/connections.action-types';

import styles from './node-list-item.module.scss';

/** Class representing a `NodeListItem`
 * @extends Component
 */
class NodeListItem extends Component {
  /**
   * It will set up default state of `NodeListItem`
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = { connections: props.connections, connectionId: props.connectionId };
  }

  /**
   * When component is mounted it will add event listener on connections update event
   */
  componentDidMount() {
    connectionsEventBus.on(CONNECTION_ADD, this.calculateConnections);
    connectionsEventBus.on(CONNECTION_REMOVE, this.calculateConnections);
    connectionsEventBus.on(CONNECTION_CALCULATE, this.calculateConnections);
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.state.connectionId && prevProps.productId !== this.props.productId) {
      const {
        nodeActions: { onConnectionRemove },
      } = this.props;

      onConnectionRemove(this.state.connectionId, () => this.setState({ connectionId: undefined }));
    }
  }

  /**
   * It will remove listeners when component will be unmount
   */
  componentWillUnmount() {
    connectionsEventBus.removeListener(CONNECTION_ADD, this.calculateConnections);
    connectionsEventBus.removeListener(CONNECTION_REMOVE, this.calculateConnections);
    connectionsEventBus.removeListener(CONNECTION_CALCULATE, this.calculateConnections);
  }

  /**
   * Getter of item id
   * @return {string} uuid of `NodeListItem`
   */
  getId = () => this.props.id;

  getConnectionId = () => this.state.connectionId;

  getConnections = () => this.state.connections;

  getProductId = () => this.props.productId;

  getNodeId = () => this.props.nodeId;

  /**
   * Helper for calculation connections for specific node based on node ID and type of item
   * @param {updateConnectionEvent} e - custom update connection event created in `GraphSpace`
   */
  calculateConnections = payload => {
    const { calculateConnections } = payload;

    this.setState({ connections: calculateConnections(this.props.id, this.props.type) });
  };

  /**
   * Handler for mouse down on `NodeListItem`. Check if connection can be created and then call `onMouseDown` from props
   * or returns `null`
   *
   * @param e
   * @return {null}
   */
  handleMouseDown = e => {
    const { portsEvents, type } = this.props;
    const { onMouseDown } = portsEvents[type];

    if (this.state.connections >= this.props.maxConnections || this.props.disabled) {
      return null;
    }

    onMouseDown(e, { id: this.props.id, nodeId: this.props.nodeId, productId: this.props.productId }, connectionId =>
      this.setState({ connectionId }),
    );
  };

  /**
   * Handler for mouse up on `NodeListItem`. Check if connection can be created and then call `onMouseUp` from props
   * or returns `null`
   *
   * @param e
   * @return {null}
   */
  handleMouseUp = e => {
    const isCompatible =
      this.props.currentConnection &&
      this.props.currentConnection.productId &&
      this.props.currentConnection.productId === this.props.productId;

    if (this.state.connections >= this.props.maxConnections || this.props.disabled || !isCompatible) {
      return null;
    }

    const { portsEvents, type } = this.props;
    const { onMouseUp } = portsEvents[type];

    onMouseUp(e, { id: this.props.id, nodeId: this.props.nodeId, productId: this.props.productId }, connectionId =>
      this.setState({ connectionId }),
    );
  };

  /**
   * Helper for render list item
   * @return {*}
   */
  renderElement = () => {
    const { nodeType, type } = this.props;
    const showAmount = nodeType === NODE_TYPES.step;

    const indicatorClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]:
        this.state.connections >= this.props.maxConnections ||
        this.props.disabled ||
        (this.props.currentConnection && this.props.currentConnection.productId !== this.props.productId),
    });

    const connection = this.props.nodeActions.getConnectionById(this.props.connectionId);
    const nodeId = type === NODE_INPUT && connection ? connection.startNode : this.props.nodeId;
    const amount = get(this.props.goods, [nodeId, this.props.productId], 0);

    const itemClassNames = classNames(styles.item, styles[`item--${this.props.type}`]);

    return (
      <li className={itemClassNames}>
        <div
          className={indicatorClassNames}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          id={this.props.id}
          data-id={this.props.id}
          data-type={type}
        />
        <span className={styles.label}>
          <span>
            {this.props.label} {showAmount && `(${amount})`}
          </span>
        </span>
      </li>
    );
  };

  render() {
    if (this.state.connections >= Number(this.props.maxConnections)) {
      return (
        <Tooltip
          placement={this.props.type === NODE_INPUT ? 'left' : 'right'}
          overlay="Maximum connections reached"
          overlayClassName="tooltip"
        >
          {this.renderElement()}
        </Tooltip>
      );
    }

    if (this.props.currentConnection && this.props.currentConnection.productId !== this.props.productId) {
      return (
        <Tooltip
          placement={this.props.type === NODE_INPUT ? 'left' : 'right'}
          overlay="Product doesn't match to input"
          overlayClassName="tooltip"
        >
          {this.renderElement()}
        </Tooltip>
      );
    }

    return this.renderElement();
  }
}

export const NodeListItemComponent = compose(
  withNodeActions,
  withCurrentConnection,
  withPortEvents,
)(NodeListItem);
