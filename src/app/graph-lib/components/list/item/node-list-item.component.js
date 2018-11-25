import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import { compose } from 'redux';

import { withCurrentConnection, withPortEvents, withNodeActions } from 'app/graph-lib/contexts';

import { NODE_INPUT, UPDATE_CONNECTIONS_EVENT } from '../../../dictionary';

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

    this.state = { connections: 0, connectionId: props.connectionId };
  }

  /**
   * When component is mounted it will add event listener on connections update event
   */
  componentDidMount() {
    document.addEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
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
    document.removeEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  /**
   * Getter of item id
   * @return {string} uuid of `NodeListItem`
   */
  getId = () => this.props.id;

  getConnectionId = () => this.state.connectionId;

  getConnections = () => this.state.connections;

  getProductId = () => this.props.productId;

  /**
   * Helper for calculation connections for specific node based on node ID and type of item
   * @param {updateConnectionEvent} e - custom update connection event created in `GraphSpace`
   */
  calculateConnections = e => {
    this.setState({ connections: e.detail.calculateConnections(this.props.id, this.props.type) });
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
    const indicatorClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]:
        this.state.connections >= this.props.maxConnections ||
        this.props.disabled ||
        (this.props.currentConnection && this.props.currentConnection.productId !== this.props.productId),
    });

    const itemClassNames = classNames(styles.item, styles[`item--${this.props.type}`]);

    return (
      <li className={itemClassNames}>
        <div
          className={indicatorClassNames}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          id={this.props.id}
          data-id={this.props.id}
          data-type={this.props.type}
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
